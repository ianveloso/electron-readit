const { autoUpdater } = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

module.exports = () => {

    // Check for update (GH Releases)
    autoUpdater.checkForUpdates();
    console.log('Checking for updates');
}