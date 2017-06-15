/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: tabs -*- */

/**
 * app-menu-window-title extension
 * @author: eternal-sorrow <sergamena at mail dot ru>
 *
 * Based on StatusTitleBar extension, written by @emerino
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see {http://www.gnu.org/licenses/}.
 *
 */

const Meta=imports.gi.Meta;
const AppMenu=imports.ui.main.panel.statusArea.appMenu;
// const Convenience=imports.misc.extensionUtils.getCurrentExtension().imports.convenience;

function set_title()
{
	if(!window)
		return;

	// if
	// (	/* Set title only on maximized windows */
	// 	(only_on_maximize)&&
	// 	(
	// 		window.get_maximized()!=
	// 		(
	// 			Meta.MaximizeFlags.VERTICAL|Meta.MaximizeFlags.HORIZONTAL
	// 		)
	// 	)
	// )
	// {
	// 	AppMenu._label.setText
	// 	(
	// 		imports.gi.Shell.WindowTracker.get_default().get_window_app
	// 		(
	// 			window
	// 		).get_name()
	// 	);
	// }
	// else
	// {
		AppMenu._label.set_text(window.get_title());
	// }
}

function on_focus_window_notify()
{
	if((window_title_notify_connection)&&(window))
		window.disconnect(window_title_notify_connection);

	window=global.display.get_focus_window();

	if(!window)
		return;

	window_title_notify_connection=window.connect
	(
			"notify::title",
			set_title
	);

	set_title();
}

// signal connections
// let app_maximize_connection=null;
// let app_unmaximize_connection=null;
let focus_window_notify_connection=null;
let window_title_notify_connection=null;
// let only_on_maximize_setting_changed_connection=null;

let settings=null;
// let only_on_maximize=null;

// not exactly the same as global.display.focus_window, but almost
let window=null;

function init()
{
	// settings=Convenience.getSettings();
	// only_on_maximize=settings.get_boolean('only-on-maximize');
}

function enable()
{
	// app_maximize_connection=global.window_manager.connect
	// (
	// 	'maximize',
	// 	set_title
	// );
	//
	// app_unmaximize_connection=global.window_manager.connect
	// (
	// 	'unmaximize',
	// 	set_title
	// );

	focus_window_notify_connection=global.display.connect
	(
		// thanks to author of "Per window keyboard layout" extension for this
		// signal. That's exactly what I needed.
		'notify::focus-window',
		on_focus_window_notify
	);

	// only_on_maximize_setting_changed_connection=settings.connect
	// (
	// 	'changed::only-on-maximize',
	// 	function()
	// 	{
	// 		only_on_maximize=settings.get_boolean('only-on-maximize');
	// 		set_title();
	// 	}
	// );

	on_focus_window_notify();
}

function disable()
{
	// disconnect signals
	// if(app_maximize_connection)
	// 	global.window_manager.disconnect(app_maximize_connection);
	// if(app_unmaximize_connection)
	// 	global.window_manager.disconnect(app_unmaximize_connection);
	// if(focus_window_notify_connection)
		global.display.disconnect(focus_window_notify_connection);
	if((window_title_notify_connection)&&(window))
		window.disconnect(window_title_notify_connection);
	// if(only_on_maximize_setting_changed_connection)
	// 	settings.disconnect(only_on_maximize_setting_changed_connection);



	//change back the app menu button's label to the application name
	//thanks @fmuellner
	AppMenu._sync();
}
