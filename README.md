# Portafolio Profesional de Ingeniería de Software (Fase 1)

Bienvenido a la implementación de la **Fase 1** de tu portafolio personal, diseñado específicamente para:
1. **Entrega Universitaria y Resume:** Cumplir con la tarea académica proporcionando un enlace profesional y en vivo a tu trabajo.
2. **Búsqueda de Empleo y Pasantías:** Comunicar alto criterio técnico, dominio de fundamentos informáticos (Python, C++, Java, SQL, DSA/Big-O) y preparación para procesos de selección en empresas de tecnología (Big Tech).
3. **Despliegue Inmediato en GitHub Pages:** Sin dependencias complejas, sin necesidad de compilar Node.js o paquetes externos; 100% estático, ligero y compatible con `tu-usuario.github.io`.

---

## 📂 Estructura del Proyecto

```text
portfolio-github-pages/
├── index.html        # Estructura principal con Tailwind CSS (Dark Mode & Responsive)
├── cv-josue.pdf      # Tu Curriculum Vitae en PDF para descarga directa
└── README.md         # Documentación y guía de despliegue paso a paso
```

---

## 🚀 Probar Localmente en tu Máquina

Puedes abrir `index.html` directamente en tu navegador favorito:
* **Opción rápida:** Haz doble clic en el archivo `index.html` desde el Explorador de Windows.
* **Opción servidor local:** Abre una terminal en esta carpeta y ejecuta:
  ```bash
  python -m http.server 8000
  ```
  Luego visita en tu navegador: `http://localhost:8000`

---

## ✏️ Guía Rápida de Personalización (Qué editar en `index.html`)

Abre `index.html` en tu editor de código (como VS Code) y busca los siguientes textos clave con `Ctrl + F`:

1. **Tu Nombre y Enlaces de Redes:**
   - Cambia `https://github.com/tu-usuario` por la URL real de tu perfil de GitHub.
   - Cambia `https://linkedin.com/in/tu-usuario` por tu perfil de LinkedIn.
   - Cambia `tu-correo@ejemplo.com` por tu correo de contacto profesional (aparece en dos lugares: en el botón de contacto y en la sección del portapapeles).
2. **Tu Curriculum Vitae (PDF):**
   - Reemplaza el archivo `cv-josue.pdf` con tu PDF real del CV manteniendo el mismo nombre (o actualiza el enlace en `index.html` si prefieres otro nombre).
3. **Tus Proyectos:**
   - En la sección `<!-- PROYECTOS DESTACADOS -->`, ajusta el título, tecnologías y enlaces de los 3 proyectos representativos con tus repositorios reales de la universidad o proyectos personales.

---

## 🌐 Publicación en GitHub Pages (Paso a Paso en 3 Minutos)

### Caso A: Si quieres que tu web sea tu dominio principal de GitHub (`tu-usuario.github.io`)
1. Ve a GitHub y crea un **nuevo repositorio público** llamado exactamente:
   `tu-usuario.github.io` *(sustituyendo `tu-usuario` por tu nombre de usuario de GitHub)*.
2. Abre tu terminal en esta carpeta (`portfolio-github-pages`) y sube el código:
   ```bash
   git init
   git add .
   git commit -m "feat: lanzamiento inicial de portafolio para GitHub Pages"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-usuario.github.io.git
   git push -u origin main
   ```
3. ¡Listo! En 1 a 2 minutos tu portafolio estará disponible mundialmente en `https://tu-usuario.github.io`.

---

### Caso B: Si prefieres crear un repositorio con otro nombre (ej. `portafolio`)
1. Crea el repositorio en GitHub (por ejemplo, `portafolio`).
2. Sube tus archivos:
   ```bash
   git init
   git add .
   git commit -m "feat: lanzamiento inicial portafolio"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/portafolio.git
   git push -u origin main
   ```
3. En GitHub, entra al repositorio y ve a:
   **Settings** (Configuración) ➔ **Pages** (en el menú lateral izquierdo).
4. En **Build and deployment**:
   - **Source:** Selecciona `Deploy from a branch`.
   - **Branch:** Selecciona `main` y la carpeta `/(root)`.
   - Haz clic en **Save**.
5. Tu sitio estará disponible en: `https://tu-usuario.github.io/portafolio/`.

---

## 🗺️ Roadmap de Fases

* [x] **Fase 1 (Must-Have):** Página estática moderna, responsive, limpia y rápida para la entrega universitaria y CV.
* [ ] **Fase 2 (Marca Personal):** Adquisición de dominio personalizado (`.dev` o `.com`) y vinculación de DNS en Cloudflare/GitHub Pages.
* [ ] **Fase 3 (Nice-to-Have Post-Graduación):** Migración a plataforma de contenido con Astro, tracker interactivo de LeetCode/HackerRank, análisis formal Big-O y videos explicativos.
