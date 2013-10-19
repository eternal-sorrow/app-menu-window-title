/**
 * app-menu-window-title extension
 * @autor: eternal-sorrow <sergamena at mail dot ru>
 *
 * Based on StatusTitleBar extension,written by @emerino
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 *
 */

const Main = imports.ui.main;

function on_app_menu_changed()
{
	let win = global.display.focus_window;
	
	if(win == null)
		return;

	if(!win._app_menu_win_ttl_chnd_sig_id_)
		init_window(win);

	Main.panel.statusArea.appMenu._label.setText(win.title);
}

function on_window_title_changed(win)
{
	if(win.has_focus())
	{
		Main.panel.statusArea.appMenu._label.setText(win.title);
	}
}

function init_window(win)
{
	if(win._app_menu_win_ttl_chnd_sig_id_)
	{
		win.disconnect(win._app_menu_win_ttl_chnd_sig_id_);
	}

	win._app_menu_win_ttl_chnd_sig_id_ = win.connect
	(
		"notify::title",
		on_window_title_changed
	);
}

let app_menu_changed_connection=null;

function init(){}

function enable()
{
	app_menu_changed_connection=Main.panel.statusArea.appMenu.connect
	(
		'changed',
		on_app_menu_changed
	);
	

	on_app_menu_changed();
}

function disable()
{
		// disconnect signals
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
}
