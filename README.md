AppMenu Window Title
====================

Gnome-Shell extension that shows the current focused window's title. It doesn't
replace the current AppButton, just changes it's label.

Extension has option whether to change label of AppButton only if maximized
windows are focused or for all windows - thanks to [Shay Elkin] (https://github.com/shayel)

Note
----

For best results, use the extension
[Extend left box] (https://extensions.gnome.org/extension/51/extend-left-box)
by [Stephen Zhang] (https://github.com/StephenPCG).

Installation
------------

    git clone https://github.com/eternal-sorrow/app-menu-window-title.git
    cd app-menu-window-title
    ./autogen.sh
    make
    make install

If you want to uninstall extension, cd to the dir app-menu-window-title and type:
    make uninstall
    

License
-------

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.

Author
------

[Eternal Sorrow](https://github.com/eternal-sorrow) (sergamena at mail dot ru)

Contains code from
[gnome-shell-extensions](https://git.gnome.org/browse/gnome-shell-extensions/)
by Giobanni Campagna
