-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-08-2020 a las 22:42:52
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_hotel`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alquiler`
--

CREATE TABLE `alquiler` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado_alquiler_id` int(10) UNSIGNED NOT NULL,
  `total` decimal(10,4) NOT NULL,
  `fecha` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` int(10) UNSIGNED NOT NULL,
  `documento_identidad_id` int(10) UNSIGNED NOT NULL,
  `nro_documento` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correlativo`
--

CREATE TABLE `correlativo` (
  `id` int(10) UNSIGNED NOT NULL,
  `documento_contable_id` int(10) UNSIGNED NOT NULL,
  `serie` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `valor` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `correlativo`
--

INSERT INTO `correlativo` (`id`, `documento_contable_id`, `serie`, `valor`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'B001', 0, '2020-06-09 21:08:38', '2020-08-08 05:06:53', NULL),
(2, 2, 'F001', 0, '2020-06-09 21:08:50', '2020-08-10 17:27:52', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_alquiler`
--

CREATE TABLE `detalle_alquiler` (
  `id` int(10) UNSIGNED NOT NULL,
  `habitacion_id` int(10) UNSIGNED NOT NULL,
  `huesped_id` int(10) UNSIGNED NOT NULL,
  `alquiler_id` int(10) UNSIGNED NOT NULL,
  `tarifa_id` int(10) UNSIGNED NOT NULL,
  `precio` decimal(10,4) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `total` decimal(10,4) NOT NULL,
  `fecha_entrada` datetime DEFAULT NULL,
  `fecha_salida` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_reserva`
--

CREATE TABLE `detalle_reserva` (
  `id` int(10) UNSIGNED NOT NULL,
  `habitacion_id` int(10) UNSIGNED NOT NULL,
  `reserva_id` int(10) UNSIGNED NOT NULL,
  `tarifa_id` int(10) UNSIGNED NOT NULL,
  `precio` decimal(10,4) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `total` decimal(10,4) NOT NULL,
  `fecha_entrada` datetime DEFAULT NULL,
  `fecha_salida` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id` int(10) UNSIGNED NOT NULL,
  `venta_id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `unidad_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,4) NOT NULL,
  `valor_venta` decimal(10,4) NOT NULL,
  `igv` decimal(10,4) NOT NULL,
  `total` decimal(10,4) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento_contable`
--

CREATE TABLE `documento_contable` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `documento_contable`
--

INSERT INTO `documento_contable` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Boleta', '2020-06-09 21:08:06', NULL, NULL),
(2, 'Factura', '2020-06-09 21:08:15', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento_identidad`
--

CREATE TABLE `documento_identidad` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `longitud` tinyint(4) NOT NULL,
  `es_numerico` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `documento_identidad`
--

INSERT INTO `documento_identidad` (`id`, `nombre`, `longitud`, `es_numerico`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'DNI', 8, 1, '2020-06-09 21:05:04', NULL, NULL),
(2, 'RUC', 11, 1, '2020-06-09 21:05:21', NULL, NULL),
(3, 'PASAPORTE', 15, 0, '2020-06-09 21:05:32', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`id`, `nombre`, `color`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'disponible', '#04C572', '2020-06-09 20:36:35', NULL, NULL),
(2, 'ocupada', '#FF9393', '2020-06-09 20:39:28', NULL, NULL),
(3, 'limpieza', '#6EA7FF', '2020-06-09 20:39:38', NULL, NULL),
(4, 'mantenimiento', '#FFB450', '2020-06-09 20:39:49', NULL, NULL),
(5, 'fuera de servicio', '#BEBABA', '2020-06-09 20:39:59', NULL, NULL),
(6, 'RESERVADO', '#f0122', '2020-08-04 04:48:43', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_alquiler`
--

CREATE TABLE `estado_alquiler` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `estado_alquiler`
--

INSERT INTO `estado_alquiler` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Pendiente de Pago', '2020-06-11 03:02:20', '2020-07-17 19:38:25', NULL),
(2, 'Pagado', '2020-07-17 18:05:32', '2020-07-17 19:38:25', NULL),
(3, 'Anulado', '2020-06-11 03:02:20', '2020-07-17 19:38:55', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_habitacion`
--

CREATE TABLE `estado_habitacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado_id` int(10) UNSIGNED NOT NULL,
  `habitacion_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `estado_habitacion`
--

INSERT INTO `estado_habitacion` (`id`, `estado_id`, `habitacion_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(712, 1, 1, '2020-08-10 20:42:13', '2020-08-10 20:42:13', NULL),
(713, 1, 2, '2020-08-10 20:42:13', '2020-08-10 20:42:13', NULL),
(714, 1, 3, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(715, 1, 4, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(716, 1, 5, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(717, 1, 6, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(718, 1, 7, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(719, 1, 8, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(720, 1, 9, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(721, 1, 11, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(722, 1, 12, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(723, 1, 13, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(724, 1, 14, '2020-08-10 20:42:14', '2020-08-10 20:42:14', NULL),
(725, 1, 15, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(726, 1, 16, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(727, 1, 17, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(728, 1, 18, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(729, 1, 19, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(730, 1, 20, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(731, 1, 21, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(732, 1, 22, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(733, 1, 24, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(734, 1, 25, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(735, 1, 26, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(736, 1, 27, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(737, 1, 28, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL),
(738, 1, 32, '2020-08-10 20:42:15', '2020-08-10 20:42:15', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_reserva`
--

CREATE TABLE `estado_reserva` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `estado_reserva`
--

INSERT INTO `estado_reserva` (`id`, `nombre`, `color`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Pendiente', '#ffb236', '2020-08-04 04:25:26', '2020-08-04 04:25:26', NULL),
(2, 'Confirmada', '#18ce0f', '2020-08-04 04:25:57', '2020-08-04 04:25:57', NULL),
(3, 'Cancelada', '#ff3636', '2020-08-04 04:26:10', '2020-08-04 04:26:10', NULL),
(4, 'Alquiler Realizado', '#007bff', '2020-08-06 21:19:46', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitacion`
--

CREATE TABLE `habitacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `piso_id` int(10) UNSIGNED NOT NULL,
  `tipo_habitacion_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `habitacion`
--

INSERT INTO `habitacion` (`id`, `piso_id`, `tipo_habitacion_id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, '101', '2020-06-09 20:51:18', NULL, NULL),
(2, 1, 2, '102', '2020-06-09 20:51:40', NULL, NULL),
(3, 1, 2, '103', '2020-06-09 20:51:50', NULL, NULL),
(4, 1, 1, '104', '2020-06-09 20:52:01', NULL, NULL),
(5, 1, 1, '105', '2020-06-09 20:52:13', NULL, NULL),
(6, 1, 3, '106', '2020-06-09 20:52:42', NULL, NULL),
(7, 1, 1, '107', '2020-06-09 20:52:54', NULL, NULL),
(8, 1, 1, '108', '2020-06-09 20:53:03', NULL, NULL),
(9, 1, 2, '109', '2020-06-09 20:53:12', NULL, NULL),
(11, 1, 2, '110', '2020-06-09 20:53:21', NULL, NULL),
(12, 2, 1, '201', '2020-06-09 20:53:56', NULL, NULL),
(13, 2, 2, '202', '2020-06-09 20:54:05', NULL, NULL),
(14, 2, 1, '203', '2020-06-09 20:54:14', NULL, NULL),
(15, 2, 3, '204', '2020-06-09 20:54:25', NULL, NULL),
(16, 3, 3, '301', '2020-06-09 20:54:36', NULL, NULL),
(17, 3, 3, '302', '2020-06-09 20:54:45', NULL, NULL),
(18, 3, 3, '303', '2020-06-09 20:58:58', NULL, NULL),
(19, 4, 1, '401', '2020-06-09 20:59:12', NULL, NULL),
(20, 4, 1, '402', '2020-06-09 20:59:23', NULL, NULL),
(21, 4, 3, '403', '2020-06-09 20:59:34', NULL, NULL),
(22, 1, 3, '404', '2020-06-09 20:59:44', '2020-07-21 01:44:27', NULL),
(24, 4, 3, '405', '2020-07-21 01:02:10', '2020-07-21 01:02:10', NULL),
(25, 4, 1, '406', '2020-07-21 01:05:17', '2020-07-21 01:44:16', NULL),
(26, 1, 2, '407', '2020-07-21 01:28:57', '2020-07-21 01:28:57', NULL),
(27, 2, 3, '408', '2020-07-21 01:43:15', '2020-07-21 01:43:15', NULL),
(28, 4, 2, '409', '2020-07-21 01:44:00', '2020-07-21 01:44:00', NULL),
(32, 2, 1, '4091', '2020-08-07 20:42:29', '2020-08-07 20:42:29', NULL),
(33, 2, 1, '666', '2020-08-10 17:31:05', '2020-08-10 17:31:16', '2020-08-10 17:31:16'),
(35, 1, 7, '666', '2020-08-10 18:31:51', '2020-08-10 18:32:04', '2020-08-10 18:32:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `huesped`
--

CREATE TABLE `huesped` (
  `id` int(10) UNSIGNED NOT NULL,
  `pais_id` int(10) UNSIGNED DEFAULT NULL,
  `sexo_id` int(10) UNSIGNED DEFAULT NULL,
  `documento_identidad_id` int(10) UNSIGNED NOT NULL,
  `nro_documento` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `nombres` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `apellidos` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `razon_social` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item`
--

CREATE TABLE `item` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `opcion_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `item`
--

INSERT INTO `item` (`id`, `nombre`, `url`, `opcion_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Menus', 'menus', 1, '2020-06-09 19:12:56', NULL, NULL),
(2, 'Roles', 'roles', 1, '2020-06-09 19:12:56', NULL, NULL),
(3, 'Administrar', 'administrar_usuarios', 2, '2020-06-09 19:12:56', NULL, NULL),
(4, 'Registrar', 'registrar_usuarios', 2, '2020-06-09 19:12:56', NULL, NULL),
(5, 'Error 500', 'error500', NULL, '2020-06-09 19:12:56', NULL, NULL),
(6, 'Error 404', 'error404', NULL, '2020-06-09 19:12:56', NULL, NULL),
(7, 'Perfil', 'perfil', NULL, '2020-06-09 19:12:56', NULL, NULL),
(8, 'Cuenta', 'cuenta', NULL, '2020-06-09 19:12:56', NULL, NULL),
(9, 'Construir Menu', 'menus/build', NULL, '2020-06-09 19:12:56', NULL, NULL),
(10, 'Cuenta', 'administrar_usuarios/cuenta', NULL, '2020-06-09 19:12:57', NULL, NULL),
(11, 'Alquiler Habitación', 'alquiler_individual', 3, '2020-06-10 22:34:20', '2020-07-20 22:49:37', NULL),
(12, 'Habitaciones', 'lista_habitaciones', 3, '2020-06-12 04:35:10', '2020-07-20 22:49:13', NULL),
(13, 'Alquiler Grupal', 'alquiler_grupal', 3, '2020-06-18 18:37:57', '2020-06-18 18:37:57', NULL),
(14, 'Pagos Pendientes', 'pagos_pendientes', 3, '2020-06-24 21:52:47', '2020-07-20 22:50:09', NULL),
(15, 'Pisos', 'pisos', 4, '2020-07-20 22:45:24', '2020-07-20 22:46:02', NULL),
(16, 'Habitación', 'habitacion', 4, '2020-07-20 22:46:56', '2020-07-20 22:50:49', NULL),
(17, 'Tipo de Habitación', 'tipo_habitacion', 4, '2020-07-21 00:36:01', '2020-07-21 00:36:01', NULL),
(18, 'Tarifa', 'tarifa', 4, '2020-07-21 00:36:15', '2020-07-21 00:36:15', NULL),
(19, 'Reporte de Ventas', 'reporte_ventas', 5, '2020-07-21 02:42:43', '2020-07-21 02:42:43', NULL),
(20, 'Reporte de Alquileres Anulados', 'reporte_alquileres_anulados', 5, '2020-07-21 16:12:12', '2020-07-21 16:12:12', NULL),
(21, 'Reporte Diario de Huespedes', 'reporte_registro_diario_huespedes', 5, '2020-07-26 03:22:14', '2020-07-26 03:22:14', NULL),
(23, 'reservar', 'reservas', 6, '2020-07-28 01:39:59', '2020-07-28 01:39:59', NULL),
(24, 'Reservaciones', 'reporte_reservaciones', 5, '2020-08-06 20:22:47', '2020-08-06 20:22:47', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_menu`
--

CREATE TABLE `item_menu` (
  `id` int(10) UNSIGNED NOT NULL,
  `item_id` int(10) UNSIGNED NOT NULL,
  `menu_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `item_menu`
--

INSERT INTO `item_menu` (`id`, `item_id`, `menu_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 7, 1),
(8, 8, 1),
(9, 9, 1),
(10, 10, 1),
(12, 12, 1),
(15, 14, 1),
(16, 15, 1),
(17, 16, 1),
(18, 17, 1),
(19, 18, 1),
(20, 19, 1),
(21, 20, 1),
(22, 21, 1),
(23, 23, 1),
(24, 24, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `rol_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id`, `nombre`, `rol_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Super Administrador', 1, '2020-06-09 19:12:55', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_05_09_121950_create_table_tipo_pago', 1),
(2, '2014_10_12_000000_create_users_table', 2),
(3, '2017_04_04_171101_create_rol_table', 2),
(4, '2017_04_04_171114_create_menu_table', 2),
(5, '2017_04_04_171125_create_opcion_table', 2),
(6, '2017_04_04_171253_create_item_table', 2),
(7, '2017_04_04_171322_create_item_menu_table', 2),
(8, '2017_04_04_171343_create_rol_user_table', 2),
(9, '2017_07_19_154926_create_token_table', 2),
(10, '2020_06_09_141543_create_piso_table', 3),
(11, '2020_06_09_142707_create_tarifa_table', 4),
(12, '2020_06_09_142741_create_tipo_habitacion_table', 4),
(13, '2020_06_09_142806_create_estado_table', 4),
(14, '2020_06_09_142828_create_pais_table', 4),
(15, '2020_06_09_142844_create_sexo_table', 4),
(16, '2020_06_09_142915_create_documento_identidad_table', 4),
(17, '2020_06_09_142935_create_documento_contable_table', 4),
(18, '2020_06_09_143022_create_producto_table', 4),
(19, '2020_06_09_143037_create_unidad_table', 4),
(20, '2020_06_09_144240_create_tarifa_tipo_habitacion_table', 4),
(21, '2020_06_09_145313_create_habitacion_table', 5),
(22, '2020_06_09_145356_create_huesped_table', 5),
(25, '2020_06_09_145547_create_correlativo_table', 5),
(26, '2020_06_09_145611_create_estado_habitacion_table', 5),
(29, '2020_06_09_115007_create_estado_alquiler_table', 6),
(31, '2020_06_09_145515_create_alquiler_table', 7),
(32, '2020_06_09_145637_create_detalle_venta_table', 8),
(33, '2020_06_09_145659_create_detalle_venta_table', 9),
(34, '2020_07_17_114932_create_detalle_alquiler_table', 9),
(36, '2020_06_09_145420_create_cliente_table', 10),
(37, '2020_06_09_145636_create_venta_table', 10),
(38, '2020_08_03_091011_create_estado_reserva_table', 11),
(39, '2020_08_03_091538_create_reserva_table', 11),
(40, '2020_08_03_091656_create_detalle_reserva_table', 11),
(41, '2020_08_07_162710_create_persona_table', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opcion`
--

CREATE TABLE `opcion` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `icono` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `opcion`
--

INSERT INTO `opcion` (`id`, `nombre`, `icono`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Seguridad', 'lock', '2020-06-09 19:12:55', NULL, NULL),
(2, 'Usuarios', 'users', '2020-06-09 19:12:56', NULL, NULL),
(3, 'Check In', 'hotel', '2020-06-10 22:34:06', '2020-06-24 21:57:06', NULL),
(4, 'Maintenances', 'wrench', '2020-07-20 22:45:02', '2020-07-20 22:45:02', NULL),
(5, 'Reportes', 'file-signature', '2020-07-21 02:38:51', '2020-07-21 02:41:10', NULL),
(6, 'Reservaciones', 'dice', '2020-07-28 01:39:14', '2020-07-28 01:39:36', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `pais`
--

INSERT INTO `pais` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Perú', '2020-06-09 21:04:36', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `nombres` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `apellidos` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `dni` varchar(8) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piso`
--

CREATE TABLE `piso` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `piso`
--

INSERT INTO `piso` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'PISO 1', '2020-06-09 20:49:37', '2020-07-20 23:17:02', NULL),
(2, 'PISO 2', '2020-06-09 20:49:43', '2020-07-20 23:16:51', NULL),
(3, 'PISO 3', '2020-06-09 20:49:50', '2020-07-20 23:16:14', NULL),
(4, 'PISO 4', '2020-06-09 20:49:57', '2020-07-20 23:15:05', NULL),
(5, 'Nuevo Piso', '2020-07-20 23:19:09', '2020-07-20 23:19:26', '2020-07-20 23:19:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ALQUILER DE HABITACIÓN', '2020-06-09 21:16:45', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado_reserva_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED NOT NULL,
  `isCancel` tinyint(1) NOT NULL DEFAULT 0,
  `total` decimal(10,4) NOT NULL,
  `fecha` datetime NOT NULL,
  `fecha_entrada` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(10) UNSIGNED NOT NULL,
  `nick` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `nivel` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nick`, `nombre`, `nivel`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'sa', 'Super Administrador', 0, '2020-06-09 19:12:55', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_user`
--

CREATE TABLE `rol_user` (
  `id` int(10) UNSIGNED NOT NULL,
  `rol_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `rol_user`
--

INSERT INTO `rol_user` (`id`, `rol_id`, `user_id`) VALUES
(1, 1, 1),
(2, 1, 4),
(4, 1, 6),
(5, 1, 9),
(6, 1, 10),
(7, 1, 11);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sexo`
--

CREATE TABLE `sexo` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `sexo`
--

INSERT INTO `sexo` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'masculino', '2020-06-09 20:44:17', NULL, NULL),
(2, 'femenino', '2020-06-09 20:44:34', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifa`
--

CREATE TABLE `tarifa` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `tarifa`
--

INSERT INTO `tarifa` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'hora', '2020-06-09 20:35:19', NULL, NULL),
(2, 'noche', '2020-06-09 20:35:27', NULL, NULL),
(3, 'mes', '2020-06-09 20:35:32', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifa_tipo_habitacion`
--

CREATE TABLE `tarifa_tipo_habitacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `tarifa_id` int(10) UNSIGNED NOT NULL,
  `tipo_habitacion_id` int(10) UNSIGNED NOT NULL,
  `precio` decimal(10,4) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `tarifa_tipo_habitacion`
--

INSERT INTO `tarifa_tipo_habitacion` (`id`, `tarifa_id`, `tipo_habitacion_id`, `precio`, `created_at`, `updated_at`, `deleted_at`) VALUES
(4, 1, 2, '12.0000', '2020-06-09 21:21:56', NULL, NULL),
(5, 2, 2, '40.0000', '2020-06-09 21:21:56', NULL, NULL),
(6, 3, 2, '60.0000', '2020-06-09 21:21:56', NULL, NULL),
(7, 1, 3, '150.0000', '2020-06-09 21:21:56', '2020-08-10 16:32:20', NULL),
(8, 2, 3, '180.0000', '2020-06-09 21:21:56', '2020-08-10 16:32:20', NULL),
(9, 3, 3, '200.0000', '2020-06-09 21:21:56', '2020-08-10 16:32:20', NULL),
(21, 3, 1, '90.0000', '2020-08-10 16:37:27', '2020-08-10 16:29:21', NULL),
(22, 1, 1, '40.0000', '2020-08-10 16:37:33', '2020-08-10 16:29:21', NULL),
(23, 2, 1, '30.0000', '2020-08-10 16:37:37', '2020-08-10 16:29:21', NULL),
(27, 1, 7, '30.0000', '2020-08-10 16:39:37', '2020-08-10 16:39:37', NULL),
(28, 2, 7, '130.0000', '2020-08-10 16:39:37', '2020-08-10 16:39:37', NULL),
(29, 3, 7, '190.0000', '2020-08-10 16:39:37', '2020-08-10 16:39:37', NULL),
(30, 1, 8, '130.0000', '2020-08-10 17:35:25', '2020-08-10 17:35:56', NULL),
(31, 2, 8, '50.0000', '2020-08-10 17:35:25', '2020-08-10 17:35:56', NULL),
(32, 3, 8, '100.0000', '2020-08-10 17:35:25', '2020-08-10 17:35:56', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_habitacion`
--

CREATE TABLE `tipo_habitacion` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `tipo_habitacion`
--

INSERT INTO `tipo_habitacion` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Simple', '2020-06-09 20:35:54', '2020-07-21 00:42:47', NULL),
(2, 'Doble', '2020-06-09 20:36:01', '2020-07-21 00:42:41', NULL),
(3, 'Matrimonial', '2020-06-09 20:36:08', '2020-07-21 00:42:34', NULL),
(7, 'semanal', '2020-08-10 16:39:37', '2020-08-10 16:39:37', NULL),
(8, 'estudiante', '2020-08-10 17:35:25', '2020-08-10 17:36:15', '2020-08-10 17:36:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token`
--

CREATE TABLE `token` (
  `id` int(10) UNSIGNED NOT NULL,
  `token` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `dispositivo` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `token`
--

INSERT INTO `token` (`id`, `token`, `dispositivo`, `ip`, `user_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, '$2y$10$W4zuVUFEAqQMldOxSyU6Ce3KXP9R3iHYdxaOczVoUrhXqzoEG7el.', NULL, '::1', 1, '2020-06-10 22:33:12', '2020-06-10 22:34:24', NULL),
(2, '$2y$10$AqFpLgJXZCO81EI4LRkeU.ZO.aeiEi29sm3aWsEak8hR19jtD37i.', NULL, '::1', 1, '2020-06-10 22:34:32', '2020-06-12 04:35:16', NULL),
(3, '$2y$10$K0BC1RDKT9eElTh4HVUbb.b.ux1U/n.CTICpzHOvZmYScKMSFgJSq', NULL, '::1', 1, '2020-06-12 04:35:33', '2020-06-15 14:59:57', NULL),
(4, '$2y$10$TS1njmAd1hAtqCMkDe2RI.1ND.NswvTSPCYL.XUgpD5yuAnRNuyIi', NULL, '::1', 1, '2020-06-16 13:00:09', '2020-06-18 18:38:01', NULL),
(5, '$2y$10$FM9ecNLvJc71eF54GVzc/eqhTapqwpu6NuZZlsoETysbhktvK7IzS', NULL, '::1', 1, '2020-06-18 18:38:10', '2020-06-24 21:52:50', NULL),
(6, '$2y$10$688Nh6PDtvGnSyIYArUuH.PDHZDtRUO.rQNlPMIOm06Y9uJ00iOLK', NULL, '::1', 1, '2020-06-24 21:53:00', '2020-06-24 21:53:26', NULL),
(7, '$2y$10$Q5L1/f7dXPzh4KqUtM69v.ux38YZo9ZW6GD4uy2EOoCbMLCKwuaEa', NULL, '::1', 1, '2020-06-24 21:53:34', '2020-06-24 21:57:19', NULL),
(8, '$2y$10$ahFtzLidtrxiTr5EXvemYezb0D9TSDSJ8EPf3yUtA8CFi0xf7mOYe', NULL, '::1', 1, '2020-06-24 21:57:32', '2020-06-26 10:55:39', NULL),
(9, '$2y$10$gMnpq3vvaBubeE9gPGf.ceNQw7Mr1KzvuYestgH6JLierGO9SBBy2', NULL, '::1', 1, '2020-07-17 02:01:31', '2020-07-20 22:50:49', NULL),
(10, '$2y$10$h.Lpkb8ZAACJTUMGqXrvae7zW2usfNaKzLxES8SdbOW0qonWQkvaK', NULL, '::1', 1, '2020-07-20 22:51:05', '2020-07-21 00:36:19', NULL),
(11, '$2y$10$Crl2JQnCJX5VwWXjzjW3luZdd3UMrzUQtykCRUhqJEVP2F6P1RaL6', NULL, '::1', 1, '2020-07-21 00:36:50', '2020-07-21 02:42:46', NULL),
(12, '$2y$10$1icDrmjGKDDbQabKef4iPe.45j9aesIBAYCoN6AO5l8FGabkJA/0e', NULL, '::1', 1, '2020-07-21 02:44:26', '2020-07-21 02:44:26', NULL),
(13, '$2y$10$kBEVf8c6AoJxDHCrOxjW3u.igq1dOq0R/diDl6pV88orWn.8MqM9e', NULL, '::1', 1, '2020-07-21 03:17:00', '2020-07-21 16:12:15', NULL),
(14, '$2y$10$ZS722d6usQV59mIsUaIPT.YcNJROGJIS6b65vhesM.cHDUQbU1oQa', NULL, '::1', 1, '2020-07-21 16:12:31', '2020-07-21 19:03:18', NULL),
(15, '$2y$10$wr5FcRbncKYiFo/dEhvz3uOMg9fI/lbhvCdsatQkidvs2UQnlS2KK', NULL, '::1', 1, '2020-07-24 03:05:18', '2020-07-24 22:28:06', NULL),
(16, '$2y$10$11McUIOkHDSEZZXZwPfuhOrSGzAaGCiKL07vNmxwFKirbsPc6Zdra', NULL, '::1', 1, '2020-07-24 22:29:42', '2020-07-26 03:22:18', NULL),
(17, '$2y$10$eR5TjTI9JfEjKUxPyCku5uzV4/xFSaRNS96PeG8AKotb46doO05Ue', NULL, '::1', 1, '2020-07-26 03:22:26', '2020-07-28 01:40:03', NULL),
(18, '$2y$10$/GzMNfjYk/ivccKuXndd2.yPUjFTXQ/ZqYTxFkSiCE6i7f2MkxS7y', NULL, '::1', 1, '2020-07-28 01:40:11', '2020-08-04 22:44:25', NULL),
(19, '$2y$10$FtGFKSIJStE.CD7HXk3W8Oao3E1a9GtXMWb303LSdKrEXpysm1BuC', NULL, '::1', 1, '2020-08-05 15:03:14', '2020-08-06 20:22:54', NULL),
(20, '$2y$10$AS5.tZ90mP6/5LsNPlkYgeFi0j5bGaNCV80V6hl/h8QNiE9TSz4la', NULL, '::1', 1, '2020-08-06 20:23:05', '2020-08-07 14:53:53', NULL),
(21, '$2y$10$700xyfo/Wxz7j9WYW8Odiu.BghUTSPe4Uakj959AnCVhAlvakHhRu', NULL, '::1', 1, '2020-08-07 14:54:03', '2020-08-09 02:15:33', NULL),
(22, '$2y$10$0C137BRtg5vgMT7.dqndN.YKPYyTsMQBO3H4SyEZsHdQxQfz7wv9W', NULL, '::1', 1, '2020-08-09 02:15:46', '2020-08-10 17:48:23', NULL),
(23, '$2y$10$e4Ei8Y7QVCv6lgS96L/xueGKSJQNnc8vAJbMzr7tpkWCUYLc1P8VC', NULL, '::1', 11, '2020-08-10 17:48:38', '2020-08-10 17:48:38', NULL),
(24, '$2y$10$nHyywhTk66c1h5D5Vv24Eeuj.kB70SpmAsXAwTaSSlJhZwJpv/rzW', NULL, '::1', 11, '2020-08-10 17:49:17', '2020-08-10 18:08:28', NULL),
(25, '$2y$10$YTuihgcTShtsUUwTzDZ7G..JUd2ZJ0UHKe.BrnyBme2wDzGc01oei', NULL, '::1', 1, '2020-08-10 18:16:22', '2020-08-10 20:42:22', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad`
--

CREATE TABLE `unidad` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `unidad`
--

INSERT INTO `unidad` (`id`, `nombre`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'UNIDAD (SERVICIO)', '2020-06-09 20:43:46', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `nick` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `profile_image` varchar(60) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'avatars/avatar.png',
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `last_updated_password` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nick`, `email`, `profile_image`, `password`, `last_updated_password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'beli', 'beli@gmail.com', 'avatars/1_20200808-091524.png', '$2y$10$Q55nM96jGRzcQqDDaOCR0..2BXnYoV7Ze6QfCFTSzmGyPYLNU01au', NULL, 'FZZOEQyOkfMusRIqffk0ZyGdVduQac0IpiIvu6KZvxDY54H3jjxfXx4aumLt', '2020-06-09 19:12:54', '2020-08-09 02:15:25', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id` int(10) UNSIGNED NOT NULL,
  `documento_contable_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED NOT NULL,
  `alquiler_id` int(10) UNSIGNED NOT NULL,
  `fecha_emision` date NOT NULL,
  `hora` char(8) COLLATE utf8_unicode_ci NOT NULL,
  `serie` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `correlativo` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `igv` decimal(10,4) NOT NULL,
  `total_valor_venta` decimal(10,4) NOT NULL,
  `total` decimal(10,4) NOT NULL,
  `total_gravado` decimal(10,4) NOT NULL,
  `total_exonerado` decimal(10,4) NOT NULL,
  `total_gratuito` decimal(10,4) NOT NULL,
  `total_inafecto` decimal(10,4) NOT NULL,
  `isCancel` tinyint(4) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alquiler`
--
ALTER TABLE `alquiler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alquiler_estado_alquiler_id_foreign` (`estado_alquiler_id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_documento_identidad_id_foreign` (`documento_identidad_id`);

--
-- Indices de la tabla `correlativo`
--
ALTER TABLE `correlativo`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `correlativo_documento_contable_id_foreign` (`documento_contable_id`) USING BTREE;

--
-- Indices de la tabla `detalle_alquiler`
--
ALTER TABLE `detalle_alquiler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_alquiler_habitacion_id_foreign` (`habitacion_id`),
  ADD KEY `detalle_alquiler_huesped_id_foreign` (`huesped_id`),
  ADD KEY `detalle_alquiler_alquiler_id_foreign` (`alquiler_id`),
  ADD KEY `detalle_alquiler_tarifa_id_foreign` (`tarifa_id`);

--
-- Indices de la tabla `detalle_reserva`
--
ALTER TABLE `detalle_reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_reserva_habitacion_id_foreign` (`habitacion_id`),
  ADD KEY `detalle_reserva_reserva_id_foreign` (`reserva_id`),
  ADD KEY `detalle_reserva_tarifa_id_foreign` (`tarifa_id`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_venta_venta_id_foreign` (`venta_id`),
  ADD KEY `detalle_venta_producto_id_foreign` (`producto_id`),
  ADD KEY `detalle_venta_unidad_id_foreign` (`unidad_id`);

--
-- Indices de la tabla `documento_contable`
--
ALTER TABLE `documento_contable`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `documento_contable_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `documento_identidad`
--
ALTER TABLE `documento_identidad`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `documento_identidad_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `estado_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `estado_alquiler`
--
ALTER TABLE `estado_alquiler`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estado_habitacion`
--
ALTER TABLE `estado_habitacion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `estado_habitacion_estado_id_foreign` (`estado_id`) USING BTREE,
  ADD KEY `estado_habitacion_habitacion_id_foreign` (`habitacion_id`) USING BTREE;

--
-- Indices de la tabla `estado_reserva`
--
ALTER TABLE `estado_reserva`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `habitacion_piso_id_foreign` (`piso_id`) USING BTREE,
  ADD KEY `habitacion_tipo_habitacion_id_foreign` (`tipo_habitacion_id`) USING BTREE;

--
-- Indices de la tabla `huesped`
--
ALTER TABLE `huesped`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `huesped_pais_id_foreign` (`pais_id`) USING BTREE,
  ADD KEY `huesped_sexo_id_foreign` (`sexo_id`) USING BTREE,
  ADD KEY `huesped_documento_identidad_id_foreign` (`documento_identidad_id`) USING BTREE;

--
-- Indices de la tabla `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `item_url_unique` (`url`) USING BTREE,
  ADD KEY `item_opcion_id_index` (`opcion_id`) USING BTREE;

--
-- Indices de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `item_menu_item_id_index` (`item_id`) USING BTREE,
  ADD KEY `item_menu_menu_id_index` (`menu_id`) USING BTREE;

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `menu_nombre_unique` (`nombre`) USING BTREE,
  ADD KEY `menu_rol_id_index` (`rol_id`) USING BTREE;

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indices de la tabla `opcion`
--
ALTER TABLE `opcion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `opcion_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `pais_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `persona_dni_unique` (`dni`),
  ADD KEY `persona_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `piso`
--
ALTER TABLE `piso`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `piso_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `producto_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reserva_estado_reserva_id_foreign` (`estado_reserva_id`),
  ADD KEY `reserva_cliente_id_foreign` (`cliente_id`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `rol_nick_unique` (`nick`) USING BTREE,
  ADD UNIQUE KEY `rol_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `rol_user`
--
ALTER TABLE `rol_user`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `rol_user_rol_id_index` (`rol_id`) USING BTREE,
  ADD KEY `rol_user_user_id_index` (`user_id`) USING BTREE;

--
-- Indices de la tabla `sexo`
--
ALTER TABLE `sexo`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `sexo_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `tarifa`
--
ALTER TABLE `tarifa`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `tarifa_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `tarifa_tipo_habitacion`
--
ALTER TABLE `tarifa_tipo_habitacion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `tarifa_tipo_habitacion_tarifa_id_foreign` (`tarifa_id`) USING BTREE,
  ADD KEY `tarifa_tipo_habitacion_tipo_habitacion_id_foreign` (`tipo_habitacion_id`) USING BTREE;

--
-- Indices de la tabla `tipo_habitacion`
--
ALTER TABLE `tipo_habitacion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `tipo_habitacion_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `token_token_unique` (`token`) USING BTREE,
  ADD KEY `token_user_id_index` (`user_id`) USING BTREE;

--
-- Indices de la tabla `unidad`
--
ALTER TABLE `unidad`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `unidad_nombre_unique` (`nombre`) USING BTREE;

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `users_nick_unique` (`nick`) USING BTREE,
  ADD UNIQUE KEY `users_email_unique` (`email`) USING BTREE;

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_documento_contable_id_foreign` (`documento_contable_id`),
  ADD KEY `venta_cliente_id_foreign` (`cliente_id`),
  ADD KEY `venta_alquiler_id_foreign` (`alquiler_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alquiler`
--
ALTER TABLE `alquiler`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `correlativo`
--
ALTER TABLE `correlativo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_alquiler`
--
ALTER TABLE `detalle_alquiler`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- AUTO_INCREMENT de la tabla `detalle_reserva`
--
ALTER TABLE `detalle_reserva`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `documento_contable`
--
ALTER TABLE `documento_contable`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `documento_identidad`
--
ALTER TABLE `documento_identidad`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `estado_alquiler`
--
ALTER TABLE `estado_alquiler`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_habitacion`
--
ALTER TABLE `estado_habitacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=739;

--
-- AUTO_INCREMENT de la tabla `estado_reserva`
--
ALTER TABLE `estado_reserva`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `habitacion`
--
ALTER TABLE `habitacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `huesped`
--
ALTER TABLE `huesped`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `item`
--
ALTER TABLE `item`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `opcion`
--
ALTER TABLE `opcion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `piso`
--
ALTER TABLE `piso`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol_user`
--
ALTER TABLE `rol_user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `sexo`
--
ALTER TABLE `sexo`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tarifa`
--
ALTER TABLE `tarifa`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tarifa_tipo_habitacion`
--
ALTER TABLE `tarifa_tipo_habitacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `tipo_habitacion`
--
ALTER TABLE `tipo_habitacion`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `token`
--
ALTER TABLE `token`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `unidad`
--
ALTER TABLE `unidad`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alquiler`
--
ALTER TABLE `alquiler`
  ADD CONSTRAINT `alquiler_estado_alquiler_id_foreign` FOREIGN KEY (`estado_alquiler_id`) REFERENCES `estado_alquiler` (`id`);

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_documento_identidad_id_foreign` FOREIGN KEY (`documento_identidad_id`) REFERENCES `documento_identidad` (`id`);

--
-- Filtros para la tabla `correlativo`
--
ALTER TABLE `correlativo`
  ADD CONSTRAINT `correlativo_documento_contable_id_foreign` FOREIGN KEY (`documento_contable_id`) REFERENCES `documento_contable` (`id`);

--
-- Filtros para la tabla `detalle_alquiler`
--
ALTER TABLE `detalle_alquiler`
  ADD CONSTRAINT `detalle_alquiler_alquiler_id_foreign` FOREIGN KEY (`alquiler_id`) REFERENCES `alquiler` (`id`),
  ADD CONSTRAINT `detalle_alquiler_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacion` (`id`),
  ADD CONSTRAINT `detalle_alquiler_huesped_id_foreign` FOREIGN KEY (`huesped_id`) REFERENCES `huesped` (`id`),
  ADD CONSTRAINT `detalle_alquiler_tarifa_id_foreign` FOREIGN KEY (`tarifa_id`) REFERENCES `tarifa` (`id`);

--
-- Filtros para la tabla `detalle_reserva`
--
ALTER TABLE `detalle_reserva`
  ADD CONSTRAINT `detalle_reserva_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacion` (`id`),
  ADD CONSTRAINT `detalle_reserva_reserva_id_foreign` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`),
  ADD CONSTRAINT `detalle_reserva_tarifa_id_foreign` FOREIGN KEY (`tarifa_id`) REFERENCES `tarifa` (`id`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `detalle_venta_unidad_id_foreign` FOREIGN KEY (`unidad_id`) REFERENCES `unidad` (`id`),
  ADD CONSTRAINT `detalle_venta_venta_id_foreign` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`);

--
-- Filtros para la tabla `estado_habitacion`
--
ALTER TABLE `estado_habitacion`
  ADD CONSTRAINT `estado_habitacion_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `estado_habitacion_habitacion_id_foreign` FOREIGN KEY (`habitacion_id`) REFERENCES `habitacion` (`id`);

--
-- Filtros para la tabla `habitacion`
--
ALTER TABLE `habitacion`
  ADD CONSTRAINT `habitacion_piso_id_foreign` FOREIGN KEY (`piso_id`) REFERENCES `piso` (`id`),
  ADD CONSTRAINT `habitacion_tipo_habitacion_id_foreign` FOREIGN KEY (`tipo_habitacion_id`) REFERENCES `tipo_habitacion` (`id`);

--
-- Filtros para la tabla `huesped`
--
ALTER TABLE `huesped`
  ADD CONSTRAINT `huesped_documento_identidad_id_foreign` FOREIGN KEY (`documento_identidad_id`) REFERENCES `documento_identidad` (`id`),
  ADD CONSTRAINT `huesped_pais_id_foreign` FOREIGN KEY (`pais_id`) REFERENCES `pais` (`id`),
  ADD CONSTRAINT `huesped_sexo_id_foreign` FOREIGN KEY (`sexo_id`) REFERENCES `sexo` (`id`);

--
-- Filtros para la tabla `item`
--
ALTER TABLE `item`
  ADD CONSTRAINT `item_opcion_id_foreign` FOREIGN KEY (`opcion_id`) REFERENCES `opcion` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `item_menu`
--
ALTER TABLE `item_menu`
  ADD CONSTRAINT `item_menu_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `item_menu_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `reserva_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `reserva_estado_reserva_id_foreign` FOREIGN KEY (`estado_reserva_id`) REFERENCES `estado_reserva` (`id`);

--
-- Filtros para la tabla `rol_user`
--
ALTER TABLE `rol_user`
  ADD CONSTRAINT `rol_user_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rol_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tarifa_tipo_habitacion`
--
ALTER TABLE `tarifa_tipo_habitacion`
  ADD CONSTRAINT `tarifa_tipo_habitacion_tarifa_id_foreign` FOREIGN KEY (`tarifa_id`) REFERENCES `tarifa` (`id`),
  ADD CONSTRAINT `tarifa_tipo_habitacion_tipo_habitacion_id_foreign` FOREIGN KEY (`tipo_habitacion_id`) REFERENCES `tipo_habitacion` (`id`);

--
-- Filtros para la tabla `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_alquiler_id_foreign` FOREIGN KEY (`alquiler_id`) REFERENCES `alquiler` (`id`),
  ADD CONSTRAINT `venta_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `venta_documento_contable_id_foreign` FOREIGN KEY (`documento_contable_id`) REFERENCES `documento_contable` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
