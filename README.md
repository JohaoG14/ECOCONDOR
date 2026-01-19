# 🦅 EcoCondor

**EcoCondor** es una plataforma móvil moderna diseñada para fomentar el reciclaje. Los usuarios pueden registrar sus actividades de reciclaje, ver su historial detallado, acumular puntos y canjearlos por recompensas exclusivas, todo gestionado en tiempo real a través de Firebase.

---

## ✨ Características Principales

*   **Autenticación Segura**: Registro e inicio de sesión integrados con **Firebase Auth**.
*   **Reciclaje Rápido**: Accesos directos desde el Home para registrar materiales (Plástico, Vidrio, Papel, etc.) al instante.
*   **Historial Detallado**: Visualización completa de todas tus actividades de reciclaje pasadas con fecha y puntos ganados.
*   **Sistema de Puntos**: Visualización en tiempo real del saldo de puntos y total de reciclajes.
*   **Catálogo de Recompensas**: Canje de puntos por productos o descuentos, gestionado por **Cloud Firestore**.
*   **Nueva Imagen Corporativa**: Branding completo con el logo del Águila EcoCondor en iconos, login y barra superior.
*   **Diseño Moderno**: Interfaz basada en **Material 3** con paleta de colores ecológica.

---

## 🛠️ Tecnologías

*   **Frontend**: Flutter (3.x)
*   **Backend / Base de Datos**: Firebase (Auth, Firestore)
*   **Diseño**: Material Design 3
*   **Iconografía**: Flutter Launcher Icons (Custom Assets)

---

## 🚀 Configuración e Instalación

### Prerrequisitos
*   [Flutter SDK](https://flutter.dev/docs/get-started/install) instalado.
*   Android Studio o VS Code configurado.
*   Un dispositivo Android o Emulador.

### Paso 1: Clonar y Preparar
```bash
git clone <tu-repositorio>
cd ECOCONDOR/ecocondor_app
flutter pub get
```

### Paso 2: Configuración de Firebase
Para que la aplicación funcione, necesitas el archivo de configuración de Firebase:
1.  Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2.  Selecciona tu proyecto.
3.  Descarga el archivo `google-services.json` de tu app Android.
4.  Coloca el archivo en:
    `ECOCONDOR/ecocondor_app/android/app/google-services.json`

### Paso 3: Índices de Firestore (Importante)
Para que el historial funcione correctamente, debes crear un índice compuesto en Firestore:
*   Colección: `recycling_history`
*   Campos: `userId` (Ascendente), `timestamp` (Descendente).

### Paso 4: Ejecutar la App
```bash
flutter run
```

---

## 📱 Estructura del Proyecto

```
lib/
├── main.dart           # Punto de entrada y configuración del tema
├── models/             # Modelos de datos (User, Recycling, Reward)
├── screens/            # Pantallas (Login, Home, Recycling, Rewards, History)
└── services/           # Lógica de negocio
    ├── auth_service.dart      # Gestión de sesión (Firebase Auth)
    └── firestore_service.dart # Gestión de datos (Firestore)
```

---

## 🧪 Pruebas y Verificación

La aplicación cuenta con un APK de depuración pre-generado listo para probar:
`C:\Users\Usuario\.gemini\antigravity\scratch\ECOCONDOR\ecocondor_app\build\app\outputs\flutter-apk\app-debug.apk`

---

## 📄 Notas de Versión
*   **v2.1.0** (Actual):
    *   Nuevo icono de lanzador (Águila).
    *   Funcionalidad de "Reciclaje Rápido" corregida.
    *   Nuevo visor de "Historial de Reciclaje".
*   **v1.0.0**: Lanzamiento inicial con integración de Firebase.
