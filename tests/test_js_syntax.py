"""
Tests for JavaScript Syntax & Code Health
Validates syntax integrity, bracket balancing, lexical scope hygiene (no duplicate const/let declarations),
no leftover debug statements, and UTF-8 encoding without BOM across all JS files.
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS_DIR = os.path.join(ROOT_DIR, "js")


def strip_js_comments_and_strings(code):
    """
    Strips comments and string literals from JS code to allow structural syntax checks.
    Preserves newlines for accurate line tracking.
    """
    output = []
    i = 0
    n = len(code)
    while i < n:
        if code[i : i + 2] == "//":
            end = code.find("\n", i)
            if end == -1:
                break
            output.append("\n")
            i = end + 1
        elif code[i : i + 2] == "/*":
            end = code.find("*/", i + 2)
            if end == -1:
                break
            newlines = code[i : end + 2].count("\n")
            output.append("\n" * newlines)
            i = end + 2
        elif code[i] == '"':
            end = i + 1
            while end < n:
                if code[end] == "\\":
                    end += 2
                elif code[end] == '"':
                    end += 1
                    break
                else:
                    end += 1
            newlines = code[i:end].count("\n")
            output.append('""' + "\n" * newlines)
            i = end
        elif code[i] == "'":
            end = i + 1
            while end < n:
                if code[end] == "\\":
                    end += 2
                elif code[end] == "'":
                    end += 1
                    break
                else:
                    end += 1
            newlines = code[i:end].count("\n")
            output.append("''" + "\n" * newlines)
            i = end
        elif code[i] == "`":
            end = i + 1
            while end < n:
                if code[end] == "\\":
                    end += 2
                elif code[end] == "`":
                    end += 1
                    break
                else:
                    end += 1
            newlines = code[i:end].count("\n")
            output.append("``" + "\n" * newlines)
            i = end
        else:
            output.append(code[i])
            i += 1
    return "".join(output)


class TestJSSyntax(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.js_files = {}
        for root, _, files in os.walk(JS_DIR):
            for file in files:
                if file.endswith(".js"):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, ROOT_DIR)
                    with open(full_path, "rb") as f:
                        raw = f.read()
                    cls.js_files[rel_path] = raw

    def test_no_utf8_bom(self):
        """Verify that no JS file starts with a UTF-8 Byte Order Mark (BOM)."""
        bom = b"\xef\xbb\xbf"
        for rel_path, raw in self.js_files.items():
            self.assertFalse(raw.startswith(bom), f"{rel_path} contains a UTF-8 BOM")

    def test_files_utf8_decodable(self):
        """Verify all JS files can be cleanly decoded as UTF-8 without errors."""
        for rel_path, raw in self.js_files.items():
            try:
                raw.decode("utf-8")
            except UnicodeDecodeError as e:
                self.fail(f"{rel_path} failed UTF-8 decoding: {e}")

    def test_no_debugger_statements(self):
        """Verify no 'debugger;' statements are left in JS production code."""
        for rel_path, raw in self.js_files.items():
            text = raw.decode("utf-8")
            cleaned = strip_js_comments_and_strings(text)
            matches = re.findall(r"\bdebugger\b", cleaned)
            self.assertEqual(matches, [], f"Found 'debugger' statement in {rel_path}")

    def test_balanced_braces_and_parentheses(self):
        """Verify that braces, brackets, and parentheses are strictly balanced in every JS file."""
        for rel_path, raw in self.js_files.items():
            text = raw.decode("utf-8")
            cleaned = strip_js_comments_and_strings(text)

            stack = []
            pairs = {")": "(", "}": "{", "]": "["}
            for idx, ch in enumerate(cleaned):
                if ch in "({[":
                    stack.append((ch, idx))
                elif ch in ")}]":
                    if not stack:
                        self.fail(f"Unmatched closing '{ch}' in {rel_path} around character {idx}")
                    top, _ = stack.pop()
                    self.assertEqual(
                        top,
                        pairs[ch],
                        f"Mismatched pair '{top}' and '{ch}' in {rel_path} around character {idx}",
                    )

            self.assertEqual(stack, [], f"Unclosed delimiters in {rel_path}: {stack}")

    def test_no_duplicate_const_or_let_declarations_in_same_scope(self):
        """Verify that no identifier is declared multiple times with const or let in the same lexical block."""
        for rel_path, raw in self.js_files.items():
            text = raw.decode("utf-8")
            cleaned = strip_js_comments_and_strings(text)

            scope_stack = [0]
            next_scope_id = 1
            seen_in_scopes = {0: {}}

            # Process characters and track line numbers
            line_no = 1
            i = 0
            n = len(cleaned)

            while i < n:
                ch = cleaned[i]
                if ch == "\n":
                    line_no += 1
                    i += 1
                    continue
                elif ch == "{":
                    scope_id = next_scope_id
                    next_scope_id += 1
                    scope_stack.append(scope_id)
                    seen_in_scopes[scope_id] = {}
                    i += 1
                    continue
                elif ch == "}":
                    if len(scope_stack) > 1:
                        scope_stack.pop()
                    i += 1
                    continue

                # Check for const or let keyword
                match = re.match(r"\b(?:const|let)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)", cleaned[i:])
                if match:
                    var_name = match.group(1)
                    curr_scope = scope_stack[-1]
                    if var_name in seen_in_scopes[curr_scope]:
                        prev_line = seen_in_scopes[curr_scope][var_name]
                        self.fail(
                            f"Duplicate declaration of '{var_name}' in the same block scope in {rel_path} "
                            f"(line {line_no}, previously declared at line {prev_line})"
                        )
                    seen_in_scopes[curr_scope][var_name] = line_no
                    i += match.end()
                else:
                    i += 1

    def test_translations_defines_i18n(self):
        """Verify translations.js defines the I18N constant."""
        self.assertIn("js\\translations.js", [p.replace("/", "\\") for p in self.js_files.keys()])
        text = self.js_files.get("js/translations.js", self.js_files.get("js\\translations.js")).decode("utf-8")
        self.assertIn("const I18N =", text)
        self.assertIn("en:", text)
        self.assertIn("es:", text)


if __name__ == "__main__":
    unittest.main()
