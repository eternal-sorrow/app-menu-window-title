## Process this file with automake to produce Makefile.in
## Created by Anjuta

packagedir = gnome-shell/extensions

EXTRA_DIST = \
	README.md \
	po/gnome-shell-extensions-app-menu-window-title.pot

SUBDIRS = src po schemas

# Remove doc directory on uninstall
uninstall-local:
	-rm -r $(extensiondir)
