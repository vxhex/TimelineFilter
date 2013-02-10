TimelineFilter
==============

Twitter Timeline Filter is a Chrome extension that allows the user to define regular expressions for filtering their Twitter timeline. Users can view the original Tweet with a click.

Once the extension is installed, you can set your regular expressions by clicking the black ghost icon. Click "update filters" to save what you have and add more. After that, the filters will be applied to your Twitter timeline the next time you refresh it.

Note: development is in alpha so there is currently no packed version of this extension. On your extension page ( chrome://extensions/ ), please check "Developer Mode" and "Load unpacked extension..." to install.

Todo
-Allow individual filters to be enabled or disabled.
-Allow user to set regexp flags. Current regexps are built with gi flags.
-Push filters to content script as soon as they're saved.
