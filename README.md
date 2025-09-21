<div align="center">

# 🎁 Desafio Amigo Secreto 🎁,🎓 Oracle Next Education - Alura Latam - G9 🎓

## 👨‍💻 **Autor**

<div align="center">

**Carlos Fabián Mesa Muñoz**

[![GitHub](https://img.shields.io/badge/GitHub-saturno024-black?style=for-the-badge&logo=github)](https://github.com/saturno024)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Carlos_Mesa-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/carlos-mesa)
[![Email](https://img.shields.io/badge/Email-contacto-red?style=for-the-badge&logo=gmail)](mailto:contacto@carlosmesa.dev)

</div>

### *aplicación web para organizar sorteos de Amigo Secreto*

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/saturno024/Desafio-Amigo-Secreto-)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/saturno024/Desafio-Amigo-Secreto-)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-semantic-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-responsive-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[🚀 **Demo en Vivo**](https://saturno024.github.io/Desafio-Amigo-Secreto/) • [📖 **Documentación**](#-documentación) • [🛠️ **Instalación**](#-instalación) • [🎯 **Características**](#-características-principales)

</div>

---

## 🌟 **Descripción del Proyecto**

**Amigo Secreto** es una aplicación web básica para simplificar la organización de sorteos de intercambio de regalos. Con un enfoque en la **experiencia de usuario**, **validaciones inteligentes** y **diseño responsive**, esta aplicación transforma un proceso tradicionalmente manual en una experiencia digital memorable.

### 🎯 **¿Por qué Amigo Secreto?**

- ✅ **Eliminación de errores humanos** en sorteos manuales
- ✅ **Validaciones avanzadas** que previenen duplicados y nombres similares
- ✅ **Interfaz intuitiva** que cualquier persona puede usar
- ✅ **Diseño responsive** que se adapta a cualquier dispositivo
- ✅ **Código limpio y mantenible** siguiendo mejores prácticas

---

## 🎯 **Características Principales**

### 🛡️ **Sistema de Validación Inteligente**
- **Detección de duplicados exactos** y nombres similares
- **Validación de caracteres** (evita números puros, caracteres repetitivos, nombres con numeros, espacios en blanco)
- **Filtro de palabras prohibidas** (admin, test, null, etc.)
- **Longitud mínima/máxima** configurable
- **Feedback en tiempo real** con indicadores visuales

### 🎨 **Experiencia de Usuario Premium**
- **Transiciones CSS suaves** y animaciones elegantes
- **Alerta verde simple** para mostrar el resultado del sorteo
- **Diseño responsive** adaptable a todos los dispositivos
- **Indicadores visuales** para validación en tiempo real
- **Notificaciones elegantes** para feedback del usuario

### 🎪 **Sorteo Simple y Efectivo**
- **Algoritmo de sorteo verdaderamente aleatorio**
- **Tiempo de suspense** optimizado para mejor experiencia
- **Alerta verde elegante** al revelar el resultado
- **Mensaje claro y directo** del ganador seleccionado
- **Animación suave** sin efectos complejos que distraigan

### ⚡ **Performance y Optimización**
- **Debouncing** en validaciones para mejor rendimiento
- **Caché de expresiones regulares** para validaciones rápidas
- **Manipulación eficiente del DOM**
- **Carga instantánea** sin dependencias externas
- **Código JavaScript** optimizado

---

## 🖼️ **Capturas de Pantalla**

<div align="center">

### 📱 **Pantalla Principal**
![Pantalla Principal](assets/Capturas/img1.png)
*Interfaz limpia y moderna con validación en tiempo real*

### 🎉 **Resultado del Sorteo**
![Resultado del Sorteo](assets/Capturas/img2.png)
*Alerta verde simple y elegante mostrando el ganador*

</div>

---

## 🚀 **Instalación**

### **Requisitos Previos**
- Navegador web moderno (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Servidor web local (opcional para desarrollo)

### **Instalación Rápida**

```bash
# Clonar el repositorio
git clone https://github.com/saturno024/Desafio-Amigo-Secreto-.git

# Navegar al directorio
cd Desafio-Amigo-Secreto-

# Abrir en el navegador
open index.html
# O usando un servidor local
python -m http.server 8000
# Luego visitar: http://localhost:8000
```

### **Estructura del Proyecto**

```
DESAFIO-AMIGO-SECRETO/
├── 📄 index.html          # Estructura HTML semantic
├── 🎨 style.css           # Estilos CSS modernos
├── ⚡ app.js              # Lógica JavaScript avanzada
├── 📖 README.md           # Este archivo
├── 📁 assets/             # Recursos multimedia
│   ├── amigo-secreto.png  # Logo principal
│   ├── play_circle_outline.png # Iconos
│   └── 📁 Capturas/       # Screenshots del proyecto
│       ├── img1.png       # Pantalla principal
│       └── img2.png       # Resultado sorteo
└── 📁 docs/              # Documentación adicional
```

---

## 🎮 **Guía de Uso**

### **1. Agregar Participantes**
```
1️⃣ Escribe el nombre en el campo de texto
2️⃣ El sistema valida automáticamente el nombre
3️⃣ Click en "Añadir" para agregarlo a la lista
4️⃣ Repite para todos los participantes
```

### **2. Realizar el Sorteo**
```
1️⃣ Asegúrate de tener al menos 2 participantes
2️⃣ Click en "Sortear Amigo"
3️⃣ Espera un momento de suspense
4️⃣ ¡Ve el resultado en una alerta verde elegante!
```

### **3. Gestionar la Lista**
```
1️⃣ Elimina participantes individualmente con ❌
2️⃣ Reinicia toda la lista con "Reiniciar"

```

---

## 🛠️ **Tecnologías y Herramientas**

<div align="center">

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | 5.0 | Estructura semántica |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | 3.0 | Estilos y animaciones |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | ES6+ | Lógica de aplicación |
| ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) | 2.0+ | Control de versiones |

</div>

### **🏗️ Arquitectura del Código**

- **📦 Patrón de Módulos**: Organización limpia del código JavaScript
- **🎯 Separación de Responsabilidades**: HTML/CSS/JS bien definidos
- **🔧 Funciones Puras**: Lógica de validación y sorteo reutilizable
- **📱 Mobile-First**: Diseño responsive desde móvil hacia desktop
- **♿ Accesibilidad**: Etiquetas ARIA y navegación por teclado

---

## 📊 **Estadísticas del Proyecto**

<div align="center">

| Métrica | Valor |
|---------|-------|
| 📁 **Líneas de Código** | ~800 líneas |
| 🎯 **Funciones** | 15+ funciones |
| 🛡️ **Validaciones** | 8 tipos diferentes |
| 🎨 **Animaciones CSS** | 8 animaciones |
| 📱 **Breakpoints** | 3 responsive |
| ⚡ **Tiempo de Carga** | <100ms |
| 🌐 **Compatibilidad** | 98% navegadores |

</div>

---

## 🐛 **Resolución de Problemas**

### **Problemas Comunes**

**❓ Los nombres no se agregan a la lista**
```
✅ Solución: Verifica que el nombre tenga al menos 2 caracteres
✅ Solución: Asegúrate de no usar palabras prohibidas (admin, test, etc.)
```

**❓ El sorteo no funciona**
```
✅ Solución: Debe haber al menos 2 participantes en la lista
✅ Solución: Verifica que JavaScript esté habilitado en tu navegador
```

**❓ Las animaciones no se ven**
```
✅ Solución: Actualiza tu navegador a una versión más reciente
✅ Solución: Verifica que CSS esté habilitado correctamente
```

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License - Puedes usar, modificar y distribuir libremente
```

---

##  **Agradecimientos**

- 🎨 **Diseño original de:**: Alura latam
- 🛠️ **Herramientas de desarrollo**: VS Code, Git, GitHub
- 🎯 **Metodología**: Agile, Test-Driven Development
- 📚 **Recursos de aprendizaje**: MDN Web Docs, JavaScript.info, Alura latam 


---

<div align="center">

**⭐ Realizado por Carlos Fabián Mesa Muñoz ⭐**

**💖 Hecho con amor 💖**

**🎓 Oracle Next Education - Alura Latam - G9 🎓**


</div>
