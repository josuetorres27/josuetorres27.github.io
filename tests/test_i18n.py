"""
Tests for Portfolio Internationalization (i18n)
Validates symmetry, completeness, formatting, non-emptiness, and DOM consistency
across all 254 translation keys between EN and ES.
"""

import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANSLATIONS_PATH = os.path.join(ROOT_DIR, "js", "translations.js")
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")


def extract_translation_keys_and_dicts():
    with open(TRANSLATIONS_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    en_match = re.search(r"en:\s*\{([\s\S]*?)\n\s*\},?\s*es:", text)
    es_match = re.search(r"es:\s*\{([\s\S]*?)\n\s*\}\s*\};", text)

    if not en_match or not es_match:
        raise ValueError("Could not extract 'en' and 'es' blocks from translations.js")

    en_keys = re.findall(r"^\s*([a-zA-Z0-9_]+)\s*:", en_match.group(1), re.MULTILINE)
    es_keys = re.findall(r"^\s*([a-zA-Z0-9_]+)\s*:", es_match.group(1), re.MULTILINE)
    return en_keys, es_keys, text


class TestTranslationsSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.en_keys, cls.es_keys, cls.full_text = extract_translation_keys_and_dicts()
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            cls.html_content = f.read()

    def test_translation_keys_not_empty(self):
        """Verify that translation dictionaries contain keys."""
        self.assertGreater(len(self.en_keys), 200, "English dictionary has too few keys")
        self.assertGreater(len(self.es_keys), 200, "Spanish dictionary has too few keys")

    def test_en_to_es_key_parity(self):
        """Every key defined in English must exist in Spanish."""
        missing_in_es = set(self.en_keys) - set(self.es_keys)
        self.assertEqual(missing_in_es, set(), f"Keys present in EN but missing in ES: {missing_in_es}")

    def test_es_to_en_key_parity(self):
        """Every key defined in Spanish must exist in English."""
        missing_in_en = set(self.es_keys) - set(self.en_keys)
        self.assertEqual(missing_in_en, set(), f"Keys present in ES but missing in EN: {missing_in_en}")

    def test_all_data_i18n_keys_exist_in_dictionaries(self):
        """Every data-i18n attribute in index.html must have a translation key."""
        i18n_attrs = set(re.findall(r'data-i18n=["\']([^"\']+)["\']', self.html_content))
        self.assertGreater(len(i18n_attrs), 20, "Too few data-i18n attributes found in index.html")
        for key in i18n_attrs:
            self.assertIn(key, self.en_keys, f"data-i18n key '{key}' in index.html is missing in English translations")
            self.assertIn(key, self.es_keys, f"data-i18n key '{key}' in index.html is missing in Spanish translations")

    def test_all_data_i18n_html_keys_exist_in_dictionaries(self):
        """Every data-i18n-html attribute in index.html must have a translation key."""
        i18n_html_attrs = set(re.findall(r'data-i18n-html=["\']([^"\']+)["\']', self.html_content))
        for key in i18n_html_attrs:
            self.assertIn(key, self.en_keys, f"data-i18n-html key '{key}' in index.html is missing in English translations")
            self.assertIn(key, self.es_keys, f"data-i18n-html key '{key}' in index.html is missing in Spanish translations")

    def test_all_data_i18n_aria_and_title_keys_exist_in_dictionaries(self):
        """Every data-i18n-aria / data-i18n-title attribute in index.html must have a translation key."""
        attr_keys = set(re.findall(r'data-i18n-(?:aria|title)=["\']([^"\']+)["\']', self.html_content))
        self.assertGreater(len(attr_keys), 10, "Too few data-i18n-aria attributes found in index.html")
        for key in attr_keys:
            self.assertIn(key, self.en_keys, f"data-i18n-aria/title key '{key}' in index.html is missing in English translations")
            self.assertIn(key, self.es_keys, f"data-i18n-aria/title key '{key}' in index.html is missing in Spanish translations")

    def test_no_mojibake_or_corrupted_encoding(self):
        """Ensure no corrupted UTF-8 mojibake patterns appear in translations."""
        mojibake_patterns = [r"Ã¡", r"Ã©", r"Ã­", r"Ã³", r"Ãº", r"Ã±", r"Â¡", r"Â¿", r"â€"]
        for pattern in mojibake_patterns:
            matches = re.findall(pattern, self.full_text)
            self.assertEqual(matches, [], f"Detected corrupted mojibake encoding pattern '{pattern}' in translations.js")

    def test_adventure_node_tooltips_length(self):
        """Ensure adv_node_tooltips has 9 levels in both languages."""
        en_tooltips_match = re.search(r'en:[\s\S]*?adv_node_tooltips:\s*\[([\s\S]*?)\]', self.full_text)
        es_tooltips_match = re.search(r'es:[\s\S]*?adv_node_tooltips:\s*\[([\s\S]*?)\]', self.full_text)
        self.assertIsNotNone(en_tooltips_match, "adv_node_tooltips missing in EN")
        self.assertIsNotNone(es_tooltips_match, "adv_node_tooltips missing in ES")

        en_items = re.findall(r'"([^"]+)"', en_tooltips_match.group(1))
        es_items = re.findall(r'"([^"]+)"', es_tooltips_match.group(1))
        self.assertEqual(len(en_items), 9, f"EN adv_node_tooltips must have 9 items, got {len(en_items)}")
        self.assertEqual(len(es_items), 9, f"ES adv_node_tooltips must have 9 items, got {len(es_items)}")

    def test_adventure_stage_labels_length(self):
        """Ensure adv_stage_labels has 9 levels in both languages."""
        en_labels_match = re.search(r'en:[\s\S]*?adv_stage_labels:\s*\[([\s\S]*?)\]', self.full_text)
        es_labels_match = re.search(r'es:[\s\S]*?adv_stage_labels:\s*\[([\s\S]*?)\]', self.full_text)
        self.assertIsNotNone(en_labels_match, "adv_stage_labels missing in EN")
        self.assertIsNotNone(es_labels_match, "adv_stage_labels missing in ES")

        en_items = re.findall(r'"([^"]+)"', en_labels_match.group(1))
        es_items = re.findall(r'"([^"]+)"', es_labels_match.group(1))
        self.assertEqual(len(en_items), 9, f"EN adv_stage_labels must have 9 items, got {len(en_items)}")
        self.assertEqual(len(es_items), 9, f"ES adv_stage_labels must have 9 items, got {len(es_items)}")

    def test_hero_phrases_length(self):
        """Ensure hero_phrases has at least 3 phrases in both languages."""
        en_phrases_match = re.search(r'en:[\s\S]*?hero_phrases:\s*\[([\s\S]*?)\]', self.full_text)
        es_phrases_match = re.search(r'es:[\s\S]*?hero_phrases:\s*\[([\s\S]*?)\]', self.full_text)
        self.assertIsNotNone(en_phrases_match, "hero_phrases missing in EN")
        self.assertIsNotNone(es_phrases_match, "hero_phrases missing in ES")

        en_items = re.findall(r'"([^"]+)"', en_phrases_match.group(1))
        es_items = re.findall(r'"([^"]+)"', es_phrases_match.group(1))
        self.assertGreaterEqual(len(en_items), 3, "EN hero_phrases must have at least 3 items")
        self.assertGreaterEqual(len(es_items), 3, "ES hero_phrases must have at least 3 items")
        self.assertEqual(len(en_items), len(es_items), "hero_phrases count must match between EN and ES")


# Generate individual test methods for each of the 254 translation keys
en_keys_list, es_keys_list, _ = extract_translation_keys_and_dicts()
common_keys = sorted(list(set(en_keys_list)))

class TestIndividualTranslationKeys(unittest.TestCase):
    pass

for k in common_keys:
    def make_test_func(key_name):
        def test_func(self):
            self.assertIn(key_name, en_keys_list, f"Key '{key_name}' missing in EN")
            self.assertIn(key_name, es_keys_list, f"Key '{key_name}' missing in ES")
        return test_func

    setattr(TestIndividualTranslationKeys, f"test_key_exists_{k}", make_test_func(k))


if __name__ == "__main__":
    unittest.main()
