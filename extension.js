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

const Lang = imports.lang;

const Shell = imports.gi.Shell;
const Main = imports.ui.main;
const Signals = imports.signals;

const app_menu_window_title_handler = new Lang.Class
({
	Name: 'app_menu_window_title_handler',

	_init: function(app_menu)
	{

		this.app_menu=app_menu;
		
		this.starting_apps = [];
		
		this.app_menu_changed = false;

		/*** Holders for local tracked signals ***/
		this.main_signals = [];
		this.ws_signals = [];
		this.target_app_signals = [];
		

		this.connect_and_track
		(
			this.main_signals,
			Shell.WindowTracker.get_default(),
			'notify::focus-app',
			Lang.bind(this,this.on_focus_app_changed)
		);

		this.connect_and_track
		(
			this.main_signals,
			global.window_manager,
			'switch-workspace',
			Lang.bind(this,this._sync)
		);

		this.connect_and_track
		(
			this.main_signals,
			global.screen,
			'notify::n-workspaces',
			Lang.bind(this,this.on_change_n_workspaces)
		);

		this.connect_and_track
		(
			this.main_signals,
			this.app_menu,
			'changed',
			Lang.bind(this,this.on_app_menu_changed)
		);


		this.on_change_n_workspaces();
	},
	
	/** Utility functions **/
	connect_and_track: function (signals,subject,name,cb)
	{
		signals.push([subject,subject.connect(name,cb)]);
	},

	disconnect_tracked_signals: function(signals)
	{
		if(signals.length<1)
			return;
		signals.forEach(function(sig){sig[0].disconnect(sig[1]);});
	},


	on_focus_app_changed: function()
	{
		if(!Shell.WindowTracker.get_default().focus_app)
		{
			// If the app has just lost focus to the panel, pretend
			// nothing happened; otherwise you can't keynav to the
			// app menu.
			if(global.stage_input_mode == Shell.StageInputMode.FOCUSED)
				return;
		}
		this._sync();
	},
	
	on_change_n_workspaces: function()
	{
		this.disconnect_tracked_signals(this.ws_signals);

		for(let i = 0;i<global.screen.n_workspaces;++i )
			this.connect_and_track
			(
				this.ws_signals,
				global.screen.get_workspace_by_index(i),
				'window-removed',
				Lang.bind(this,this._sync)
			);
	},


	on_window_title_changed: function(win)
	{
		if(win.has_focus())
		{
			this.app_menu._label.setText(win.title);
		}
	},

	on_app_menu_changed: function()
	{
		this.app_menu_changed=true;
		this._sync();
		this.app_menu_changed=false;
	},
	


	/** Actually: sync  **/
	_sync: function()
	{
		let win = global.display.focus_window;
		
		if(win == null)
			return;

		if(!win._app_menu_win_ttl_chnd_sig_id_)
			this.init_window(win);

		this.app_menu._label.setText(win.title);

		this.disconnect_tracked_signals(this.target_app_signals);

		if(!this.app_menu_changed)
			this.app_menu.emit('changed');
	},



	init_window: function(win)
	{
		if(win._app_menu_win_ttl_chnd_sig_id_)
		{
			win.disconnect(win._app_menu_win_ttl_chnd_sig_id_);
		}

		win._app_menu_win_ttl_chnd_sig_id_ = win.connect
		(
			"notify::title",
			Lang.bind(this,this.on_window_title_changed)
		);
	},

	destroy: function()
	{
		// disconnect signals
		this.disconnect_tracked_signals(this.main_signals);

		// any signals from on_change_n_workspaces
		this.disconnect_tracked_signals(this.ws_signals);

		// any signals from init_window.
		// _sync requires the _app_menu_win_ttl_chnd_sig_id_.
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

		// any signals from _sync
		this.disconnect_tracked_signals(this.target_app_signals);

		// Call parent destroy.
		this.parent();
	}
});

Signals.addSignalMethods(app_menu_window_title_handler.prototype);

// lightweight object,acts only as a holder when ext disabled
let handler = null; 

function init()
{

}

function enable()
{
	handler = new app_menu_window_title_handler
	(
		Main.panel.statusArea.appMenu
	);
}

function disable()
{
	handler.destroy();
}
