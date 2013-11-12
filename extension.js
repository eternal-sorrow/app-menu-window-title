/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: tabs -*- */

/**
 * app-menu-window-title extension
 * @author: eternal-sorrow <sergamena at mail dot ru>
 *
 * Based on StatusTitleBar extension, written by @emerino
 *
 * This extension makes the AppMenuButton show the title of
 * the current focused window,instead of the application's name.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see {http://www.gnu.org/licenses/}.
 *
 */

const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Meta = imports.gi.Meta;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Convenience = ExtensionUtils.getCurrentExtension().imports.convenience;

function set_title(win)
{
	/* Set title only on maximized windows */
	let win_title_only_on_maximize = _settings.get_boolean('only-on-maximize');
	let title;

	if
	(
		win_title_only_on_maximize &&
		(win.get_maximized() != Meta.MaximizeFlags.BOTH)
	)
	{
		let tracker=Shell.WindowTracker.get_default();
		let app=tracker.get_window_app(win);
		title=app.get_name();	
	}
	else
	{
		title = win.get_title();
	}

	Main.panel.statusArea.appMenu._label.setText(title);
}

function on_signal()
{
	let win = global.display.get_focus_window();
	
	if(win == null)
		return;

	if(!win._app_menu_win_ttl_chnd_sig_id_)
		win._app_menu_win_ttl_chnd_sig_id_ = win.connect
		(
			"notify::title",
			on_window_title_changed
		);


	set_title(win);
}

function on_window_title_changed(win)
{
	if(win.has_focus())
	{
		set_title(win)
	}
}
let on_window_created = null;
let app_menu_changed_connection=null;
let app_maximize_connection=null;
let app_unmaximize_connection=null;
let _settings=null;

function init()
{
	_settings = Convenience.getSettings();
}

function enable()
{
	global.get_window_actors().forEach(function(actor) {
		var meta_win = actor.get_meta_window();
		if (meta_win) {
			meta_win.connect('focus', on_signal);
		}
		return;
	});

	on_window_created = global.display.connect('window-created', function(display, win) {
		win.connect('focus', on_signal);
	});

	app_menu_changed_connection=Main.panel.statusArea.appMenu.connect
	(
		'changed',
		on_signal
	);

	app_maximize_connection = global.window_manager.connect
	(
		'maximize',
		on_signal
	);

	app_unmaximize_connection = global.window_manager.connect
	(
		'unmaximize',
		on_signal
	);


	on_signal();
}

function disable()
{
	// disconnect signals

	global.get_window_actors().forEach(function(actor) {
		var meta_win = actor.get_meta_window();
		if (meta_win) {
			meta_win.disconnect(on_signal);
		}
		return;
	});

	global.display.disconnect(on_window_created);

	Main.panel.statusArea.appMenu.disconnect(app_menu_changed_connection);

	let windows = global.get_window_actors();

	for (let i = 0; i < windows.length; ++i)
	{
		let win = windows[i];
		if(win._app_menu_win_ttl_chnd_sig_id_)
		{
			win.disconnect(win._app_menu_win_ttl_chnd_sig_id_);
			delete win._app_menu_win_ttl_chnd_sig_id_;
		}
	}

	if (app_maximize_connection)
		global.window_manager.disconnect(app_maximize_connection);
	if (app_unmaximize_connection)
		global.window_manager.disconnect(app_unmaximize_connection);

	//change back the app menu button's label to the application name
	//(c)fmuellner
	Main.panel.statusArea.appMenu._sync();
}
