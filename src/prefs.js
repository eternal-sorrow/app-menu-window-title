/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: tabs -*- */

/**
 * app-menu-window-title extension preferences
 * @author: Shay Elkin <shay@shayel.org>
 *
 * This extension makes the AppMenuButton show the title of
 * the current focused window, instead of the application's name.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 *
 */

const Gtk = imports.gi.Gtk;
const Convenience = imports.misc.extensionUtils.getCurrentExtension().imports.convenience;

const locale_domain="gnome-shell-extensions-app-menu-window-title";
const _= imports.gettext.domain(locale_domain).gettext;

function init()
{
	Convenience.initTranslations(locale_domain);
}

function buildPrefsWidget() {
	let settings = Convenience.getSettings();
	
	let frame = new Gtk.Box
	({
		orientation: Gtk.Orientation.HORIZONTAL,
		border_width: 10
	});

	frame.pack_start
	(
		new Gtk.Label
		({
			label:_("Show title for maximized windows only"),
			xalign:0
		}),
		true,
		true,
		0
	);

	let current = settings.get_boolean('only-on-maximize');
	
	let maximized_only = new Gtk.Switch();
	maximized_only.set_active(current);
	maximized_only.connect
	(
		'notify::active',
		function(btn)
		{
			settings.set_boolean('only-on-maximize', btn.get_active());
		}
	);

	frame.add(maximized_only);

	frame.show_all();
	return frame;
}


