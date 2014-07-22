dnl Process this file with autoconf to produce a configure script.
dnl Created by Anjuta application wizard.

AC_INIT([app-menu-window-title], 7, [https://github.com/eternal-sorrow/app-menu-window-title/issues])

AC_PREFIX_DEFAULT([${HOME}/.local/])

extensiondir='${prefix}/share/gnome-shell/extensions/app-menu-window-title@eternal-sorrow.github.com'
AC_SUBST(extensiondir)

IT_PROG_INTLTOOL([0.40.0])

GETTEXT_PACKAGE="gnome-shell-extensions-app-menu-window-title"
AC_SUBST(GETTEXT_PACKAGE)

localedir="${extensiondir}/locale";
AC_SUBST(localedir)

GLIB_GSETTINGS

AM_INIT_AUTOMAKE([1.11 foreign])

AM_SILENT_RULES([yes])

AC_OUTPUT([
Makefile
src/Makefile
schemas/Makefile
po/Makefile.in
])
