"""
Tests for Portfolio DOM & HTML Integrity
Validates DOCTYPE, meta tags, OpenGraph, JSON-LD Schema, Section IDs,
Element ID uniqueness, JavaScript element binding targets, and accessibility.
"""

import json
import os
import re
import unittest
from html.parser import HTMLParser

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")


class TagCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.ids = []
        self.images = []
        self.links = []
        self.buttons = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        self.tags.append((tag, attr_dict))
        if "id" in attr_dict:
            self.ids.append(attr_dict["id"])
        if tag == "img":
            self.images.append(attr_dict)
        if tag == "a":
            self.links.append(attr_dict)
        if tag == "button":
            self.buttons.append(attr_dict)


class TestDOMIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            cls.html = f.read()

        cls.collector = TagCollector()
        cls.collector.feed(cls.html)

    def test_doctype_and_html_tag(self):
        """Verify proper HTML5 DOCTYPE and html tag declaration."""
        self.assertTrue(self.html.lstrip().startswith("<!DOCTYPE html>"), "Missing <!DOCTYPE html>")
        self.assertRegex(self.html, r'<html\s+lang=["\'](en|es)["\']', "Missing html tag with lang attribute")

    def test_charset_meta_tag(self):
        """Verify UTF-8 charset meta tag is declared."""
        self.assertRegex(self.html, r'(?i)<meta\s+charset=["\']utf-8["\']', "Missing UTF-8 charset meta tag")

    def test_viewport_meta_tag(self):
        """Verify mobile-responsive viewport meta tag."""
        self.assertRegex(self.html, r'<meta\s+name=["\']viewport["\']', "Missing viewport meta tag")
        self.assertIn("width=device-width", self.html, "Viewport missing width=device-width")

    def test_title_tag(self):
        """Verify page title exists and is non-empty."""
        match = re.search(r"<title>(.*?)</title>", self.html, re.IGNORECASE | re.DOTALL)
        self.assertIsNotNone(match, "Missing <title> tag")
        self.assertGreater(len(match.group(1).strip()), 5, "Page title is too short or empty")

    def test_meta_description(self):
        """Verify SEO meta description exists and is descriptive."""
        match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', self.html, re.IGNORECASE)
        self.assertIsNotNone(match, "Missing meta description")
        self.assertGreater(len(match.group(1).strip()), 20, "Meta description is too short")

    def test_opengraph_meta_tags(self):
        """Verify essential OpenGraph meta tags (title, description, type, url)."""
        required_og = ["og:title", "og:description", "og:type", "og:url"]
        for prop in required_og:
            match = re.search(rf'<meta\s+property=["\']{prop}["\']\s+content=["\'](.*?)["\']', self.html)
            self.assertIsNotNone(match, f"Missing OpenGraph tag: {prop}")
            self.assertTrue(bool(match.group(1).strip()), f"OpenGraph tag {prop} content is empty")

    def test_favicon_link(self):
        """Verify favicon link exists."""
        match = re.search(r'<link\s+rel=["\']icon["\']', self.html, re.IGNORECASE)
        self.assertIsNotNone(match, "Missing favicon link")

    def test_schema_jsonld_validity(self):
        """Verify that Schema.org JSON-LD structured data is present and valid JSON."""
        match = re.search(r'<script\s+type=["\']application/ld\+json["\']\s*>([\s\S]*?)</script>', self.html)
        self.assertIsNotNone(match, "Missing Schema.org JSON-LD script")
        try:
            data = json.loads(match.group(1).strip())
        except json.JSONDecodeError as e:
            self.fail(f"Invalid JSON-LD schema: {e}")

        self.assertIn("@context", data, "JSON-LD missing @context")
        has_type = "@type" in data
        has_graph = "@graph" in data and isinstance(data["@graph"], list)
        self.assertTrue(has_type or has_graph, "JSON-LD missing @type or @graph")

    def test_no_duplicate_element_ids(self):
        """Verify there are zero duplicate IDs across the entire HTML document."""
        ids = self.collector.ids
        from collections import Counter
        counts = Counter(ids)
        duplicates = [item for item, count in counts.items() if count > 1]
        self.assertEqual(duplicates, [], f"Found duplicate element IDs in index.html: {duplicates}")

    def test_essential_section_ids_exist(self):
        """Verify that all portfolio sections exist as IDs in index.html."""
        sections = [
            "hero",
            "about",
            "experience",
            "education",
            "skills",
            "projects",
            "ai",
            "mindset",
            "interests",
            "contact",
        ]
        for sec in sections:
            self.assertIn(sec, self.collector.ids, f"Section id='{sec}' missing in index.html")

    def test_javascript_binding_targets_exist(self):
        """Verify that all element IDs referenced by JavaScript interactivity exist in DOM."""
        js_targets = [
            "hero-cv-btn",
            "hero-cv-dropdown",
            "hero-cv-container",
            "copy-email-btn",
            "email-text",
            "copy-icon",
            "check-icon",
            "theme-toggle-btn",
            "theme-toggle-mobile",
            "lang-btn-en",
            "lang-btn-es",
            "lang-btn-en-m",
            "lang-btn-es-m",
            "hero-typewriter",
            "photo-carousel-track",
            "photo-prev-btn",
            "photo-next-btn",
            "photo-carousel-container",
            "photo-dots-container",
            "image-lightbox-modal",
            "lightbox-img",
            "lightbox-caption",
            "lightbox-close-btn",
            "start-adventure-btn",
            "adventure-rail",
            "adventure-rail-wrapper",
            "adventure-dialogue-box",
            "adventure-dialogue-inner",
            "dialogue-stage-label",
            "dialogue-text",
            "dialogue-avatar-btn",
            "dialogue-avatar-sprite",
            "dialogue-mute-btn",
            "dialogue-mute-img",
            "dialogue-close-btn",
            "rail-character-walker",
            "rail-character-scale-wrap",
            "rail-character-sprite",
            "rail-active-indicator",
            "rail-exit-btn",
            "rail-exit-tooltip",
            "hero-photo-card",
            "hero-photo-wrapper",
            "hero-profile-img",
            "hero-portal-overlay",
            "hero-portal-sprite-wrap",
            "hero-portal-sprite",
            "adventure-stage-wrapper",
        ]
        for target in js_targets:
            self.assertIn(target, self.collector.ids, f"Required JS binding target id='{target}' missing in index.html")

    def test_all_images_have_alt_attribute(self):
        """Verify accessibility: every img tag has an alt attribute."""
        for img in self.collector.images:
            self.assertIn("alt", img, f"Image tag missing alt attribute: {img.get('src', 'unknown src')}")

    def test_external_links_security(self):
        """Verify all external target='_blank' links have rel='noopener noreferrer'."""
        for link in self.collector.links:
            target = link.get("target")
            href = link.get("href", "")
            if target == "_blank" and href.startswith("http"):
                rel = link.get("rel", "")
                self.assertIn("noopener", rel, f"External link {href} missing 'noopener' in rel")
                self.assertIn("noreferrer", rel, f"External link {href} missing 'noreferrer' in rel")

    def test_buttons_accessibility(self):
        """Verify buttons have text, title, or aria-label for screen reader accessibility."""
        for btn in self.collector.buttons:
            has_aria = "aria-label" in btn or "aria-labelledby" in btn or "title" in btn
            btn_id = btn.get("id", "")
            if btn_id in ["copy-email-btn", "theme-toggle-btn", "theme-toggle-mobile", "lightbox-close-btn", "rail-exit-btn", "dialogue-close-btn", "dialogue-mute-btn"]:
                self.assertTrue(has_aria, f"Icon button id='{btn_id}' missing aria-label or title for accessibility")


if __name__ == "__main__":
    unittest.main()
