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
            "portfolio-loader",
            "loader-sprite",
            "loader-progress-bar",
            "loader-status-text",
            "loader-percent",
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

    def test_audio_suppressed_during_preloader(self):
        """Verify audio system and UI preloader cooperate to maintain 100% silence during loading."""
        audio_path = os.path.join(ROOT_DIR, "js", "modules", "audio.js")
        ui_path = os.path.join(ROOT_DIR, "js", "modules", "ui.js")
        index_path = os.path.join(ROOT_DIR, "index.html")

        with open(audio_path, "r", encoding="utf-8") as f:
            audio_code = f.read()
        with open(ui_path, "r", encoding="utf-8") as f:
            ui_code = f.read()
        with open(index_path, "r", encoding="utf-8") as f:
            index_code = f.read()

        # Audio module checks preloader active status before synthesizing or unlocking
        self.assertIn("isPreloaderActive", audio_code)
        self.assertIn("portfolio-loader", audio_code)
        self.assertIn("__portfolioLoaderActive", audio_code)

        # UI module and index.html manage the preloader flag
        self.assertIn("__portfolioLoaderActive = true", index_code)
        self.assertIn("__portfolioLoaderActive = true", ui_code)
        self.assertIn("__portfolioLoaderActive = false", ui_code)

        # Adventure dialogue & UI updates do not run or play speaking blips when adventure mode is not active
        adv_path = os.path.join(ROOT_DIR, "js", "modules", "adventure.js")
        with open(adv_path, "r", encoding="utf-8") as f:
            adv_code = f.read()
        self.assertIn("function typeAdventureDialogue(text, onComplete) {\n    if (!isAdventureActive) return;", adv_code)
        self.assertIn("function updateAdventureUI(skipWalkerAnim) {\n    if (!isAdventureActive) return;", adv_code)

    def test_pulsing_badges_have_no_text_shadow(self):
        """Verify that pulsing dot status/project badges have no inline filter: drop-shadow creating duplicate letters."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()

        # Find all divs containing animate-pulse dots
        pulse_badge_matches = re.findall(r'<div[^>]*class="[^"]*pixel-corners-btn[^"]*"[^>]*style="[^"]*drop-shadow[^"]*"[^>]*>\s*<span[^>]*animate-pulse', index_code)
        self.assertEqual(len(pulse_badge_matches), 0, f"Found pulsing badges with drop-shadow duplicating letters: {pulse_badge_matches}")

    def test_navbar_monogram_icon_source(self):
        """Verify the navbar monogram icon references ./img/icons/favicon.png."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()
        self.assertIn('<img src="./img/icons/favicon.png" alt="Josue" class="w-full h-full object-cover pixelated" />', index_code)

    def test_sun_button_light_background_restored(self):
        """Verify the sun button in light mode has its clean white background restored."""
        css_path = os.path.join(ROOT_DIR, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()

        self.assertIn("html.light #theme-toggle-btn::before", css_code)
        self.assertIn("background: #ffffff !important; /* Clean normal white button surface (restored from gray) */", css_code)

    def test_primary_button_hover_effects(self):
        """Verify primary blue/celeste button has an illuminated hover effect and glow in light mode."""
        css_path = os.path.join(ROOT_DIR, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()

        self.assertIn("html.light .pixel-btn-primary:hover", css_code)
        self.assertIn("background: #38bdf8 !important;", css_code)
        self.assertIn("rgba(56, 189, 248, 0.5)", css_code)

    def test_stepped_border_badges_light_mode_corners(self):
        """Verify tech capsules and Guía badges use stepped border bevel system with 1.5px inset in light mode."""
        css_path = os.path.join(ROOT_DIR, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()

        # Slate tech capsules
        self.assertIn("html.light .pixel-corners-btn.border-slate-700\\/60", css_code)
        self.assertIn("background: #cbd5e1 !important;", css_code)

        # Cyan badges (Guía badge)
        self.assertIn("html.light .pixel-corners-btn.border-cyan-800\\/60", css_code)
        self.assertIn("background: #0284c7 !important;", css_code)

    def test_hero_bio_has_period_with_nowrap_protection(self):
        """Verify hero bio has the final period (.) in both EN and ES, protected by whitespace-nowrap with C# / .NET so it never orphans alone."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()
        with open(os.path.join(ROOT_DIR, "js", "translations.js"), "r", encoding="utf-8") as f:
            trans_code = f.read()

        # Protected structure: whitespace-nowrap wrapper around badge and period
        nowrap_pattern = r'<span class="whitespace-nowrap"><span[^>]*>C# / \.NET</span>\.</span>'
        self.assertRegex(index_code, nowrap_pattern, "index.html missing whitespace-nowrap protected period after C# / .NET")

        matches = re.findall(nowrap_pattern, trans_code)
        self.assertEqual(len(matches), 2, "translations.js must have whitespace-nowrap protected period in both EN and ES hero_bio")

    def test_loader_init_text_has_no_brackets(self):
        """Verify the preloader initialization status text has no enclosing brackets [] in HTML and translations."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()
        with open(os.path.join(ROOT_DIR, "js", "translations.js"), "r", encoding="utf-8") as f:
            trans_code = f.read()

        # In index.html
        self.assertNotIn("[ SYSTEM INITIALIZING ]", index_code)
        self.assertNotIn("[ INICIALIZANDO SISTEMA ]", index_code)
        self.assertIn("SYSTEM INITIALIZING", index_code)

        # In translations.js
        self.assertNotIn('loader_init: "[', trans_code)
        self.assertNotIn(']"', trans_code.split("loader_init")[1].split("\n")[0])
        self.assertIn('loader_init: "SYSTEM INITIALIZING"', trans_code)
        self.assertIn('loader_init: "INICIALIZANDO SISTEMA"', trans_code)

    def test_hero_mobile_spacing_compact(self):
        """Verify hero section does not have excessive empty space (pt-20) on mobile between subnav and status badge."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()

        hero_section_match = re.search(r'<section id="hero" class="([^"]+)"', index_code)
        self.assertIsNotNone(hero_section_match, "Hero section not found in index.html")
        classes = hero_section_match.group(1).split()

        # Ensure pt-20 is not used as base mobile padding
        self.assertNotIn("pt-20", classes, "Hero section has excessive mobile padding pt-20 (80px gap)")
        # Ensure a compact mobile padding like pt-6, pt-7, or pt-8 is used
        has_compact_pt = any(c in classes for c in ["pt-5", "pt-6", "pt-7", "pt-8"])
        self.assertTrue(has_compact_pt, f"Hero section missing compact mobile padding, found: {classes}")
        # Ensure desktop padding is preserved
        self.assertIn("md:pt-28", classes)

    def test_hero_cursor_blink_calmed(self):
        """Verify the hero typewriter cursor blink rate is slowed down to 1s (calmed by ~0.2s from 0.8s)."""
        css_path = os.path.join(ROOT_DIR, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()

        self.assertNotIn("animation: cursorBlink 0.8s infinite;", css_code)
        self.assertIn("animation: cursorBlink 1s infinite;", css_code)

    def test_preloader_animation_and_fadeout_integrity(self):
        """Verify preloader fadeout transition, hidden styles, and progress animation logic."""
        css_path = os.path.join(ROOT_DIR, "css", "styles.css")
        ui_path = os.path.join(ROOT_DIR, "js", "modules", "ui.js")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()
        with open(ui_path, "r", encoding="utf-8") as f:
            ui_code = f.read()

        # CSS transitions and hidden state
        self.assertIn("transition: opacity 0.4s ease-out;", css_code)
        self.assertIn("#portfolio-loader.loader-hidden", css_code)
        self.assertIn("opacity: 0 !important;", css_code)
        self.assertIn("pointer-events: none !important;", css_code)

        # UI dismissal sequence in ui.js
        self.assertIn("progressBar.style.width = '100%'", ui_code)
        self.assertIn("percentText.textContent = '100%'", ui_code)
        self.assertIn("loader.classList.add('loader-hidden')", ui_code)
        self.assertIn("loader.style.display = 'none'", ui_code)

        # Progress calculation logic (min 15%, max 100%, fallback 2500ms)
        self.assertIn("Math.min(100, Math.max(15, Math.round(ratio * 100)))", ui_code)
        self.assertIn("setTimeout(dismissLoader, 2500)", ui_code)

    def test_loader_progress_bar_wrapper_container(self):
        """Verify the loading bar on the preloader screen has an outer wrapper casing container that encases the chassis and bar."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()
        css_path = os.path.join(ROOT_DIR, "css", "styles.css")
        with open(css_path, "r", encoding="utf-8") as f:
            css_code = f.read()

        # HTML structure: outer wrapper container enclosing chassis and bar
        self.assertIn("loader-progress-wrapper", index_code)
        self.assertIn("loader-progress-chassis", index_code)
        self.assertIn("loader-progress-bar", index_code)

        # Ensure hierarchy: wrapper surrounds chassis and bar inside #portfolio-loader
        wrapper_match = re.search(r'class="[^"]*loader-progress-wrapper[^"]*"[^>]*>[\s\S]*?class="[^"]*loader-progress-chassis[^"]*"[\s\S]*?id="loader-progress-bar"', index_code)
        self.assertIsNotNone(wrapper_match, "loader-progress-wrapper must enclose loader-progress-chassis and loader-progress-bar")

        # CSS styling: wrapper has stepped border and casing in both dark and light modes
        self.assertIn("#portfolio-loader .loader-progress-wrapper", css_code)
        self.assertIn("html.light #portfolio-loader .loader-progress-wrapper", css_code)
        self.assertIn("#portfolio-loader .loader-progress-chassis", css_code)
        self.assertIn("html.light #portfolio-loader .loader-progress-chassis", css_code)

    def test_preloader_bilingual_full_implementation(self):
        """Verify preloader is fully implemented in both languages without language bleed or hardcoded Spanish leaks."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_code = f.read()
        with open(os.path.join(ROOT_DIR, "js", "translations.js"), "r", encoding="utf-8") as f:
            trans_code = f.read()
        with open(os.path.join(ROOT_DIR, "js", "modules", "i18n.js"), "r", encoding="utf-8") as f:
            i18n_code = f.read()
        with open(os.path.join(ROOT_DIR, "js", "main.js"), "r", encoding="utf-8") as f:
            main_code = f.read()

        # 1. Default index.html preloader is 100% English (matches site default lang="en")
        loader_markup = index_code.split('<div id="portfolio-loader"')[1].split('</div>\n  </div>')[0]

        self.assertIn('aria-label="Loading portfolio..."', loader_markup)
        self.assertIn('alt="Loading..."', loader_markup)
        self.assertIn('SYSTEM INITIALIZING', loader_markup)
        self.assertIn('LOADING ASSETS...', loader_markup)
        self.assertNotIn('CARGANDO ASSETS...', loader_markup)
        self.assertNotIn('Cargando portafolio...', loader_markup)

        # 2. Instant preloader language hydration script exists right after portfolio-loader
        self.assertIn("localStorage.getItem('portfolio_lang') || 'en'", index_code)
        self.assertIn("INICIALIZANDO SISTEMA", index_code)
        self.assertIn("CARGANDO ASSETS...", index_code)

        # 3. Bilingual completeness in translations.js
        self.assertIn('loader_init: "SYSTEM INITIALIZING"', trans_code)
        self.assertIn('loader_status: "LOADING ASSETS..."', trans_code)
        self.assertIn('loader_aria: "Loading portfolio..."', trans_code)
        self.assertIn('loader_alt: "Loading..."', trans_code)

        self.assertIn('loader_init: "INICIALIZANDO SISTEMA"', trans_code)
        self.assertIn('loader_status: "CARGANDO ASSETS..."', trans_code)
        self.assertIn('loader_aria: "Cargando portafolio..."', trans_code)
        self.assertIn('loader_alt: "Cargando..."', trans_code)

        # 4. i18n module updates preloader ARIA and alt on language switch
        self.assertIn("portfolio-loader", i18n_code)
        self.assertIn("loader-sprite", i18n_code)

        # 5. Application bootstrap runs i18n before UI preloader initialization
        i18n_pos = main_code.find("PortfolioI18n.init")
        ui_pos = main_code.find("PortfolioUI.init")
        self.assertTrue(i18n_pos < ui_pos, "PortfolioI18n.init must run before PortfolioUI.init to ensure translated DOM")



if __name__ == "__main__":
    unittest.main()
