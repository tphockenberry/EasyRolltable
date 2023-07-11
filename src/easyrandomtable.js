Hooks.on("renderSidebarTab", async (app, html) => {
    if (!game.user.isGM) {
        return;
    }
    if (app.id === "tables") {
        // -- Values Mode --
        let csvButton = $(`<button class='new-easytable'><i class='fas fa-file-csv'></i> ${game.i18n.localize("EASYTABLE.ui.button-csv-title")}</button>`)
        let settings = game.settings.get("easyrandomtable", "tableSettings")
        let title = settings.title;
        let description = settings.description;
        let csvData = settings.data;
        let separator = settings.separator;
        csvButton.click(function () {
            new Dialog({
                title: game.i18n.localize("EASYTABLE.ui.dialog.csv.title"),
                content: `
                <div>
                    <div class="form-group"><div>${game.i18n.localize("EASYTABLE.ui.dialog.csv.table-title")}</div><input type='text' name="tableTitle" value="${title}"/></div>
                    <div class="form-group"><div>${game.i18n.localize("EASYTABLE.ui.dialog.csv.table-description")}</div><input type='text' name="tableDescription" value="${description}"/></div>
                    <div class="form-group" title="${game.i18n.localize("EASYTABLE.ui.dialog.csv.csv-data-tooltip")}"><div>${game.i18n.localize("EASYTABLE.ui.dialog.csv.csv-data")}</div><textarea class="easytable-textarea" name="csv">${csvData}</textarea></div>
                    <div class="form-group" title="${game.i18n.localize("EASYTABLE.ui.dialog.csv.separator-tooltip")}"><div>${game.i18n.localize("EASYTABLE.ui.dialog.csv.separator")}</div><input type='text' name="separator" maxlength="1" value="${separator}"/></div>
                    <div class="form-group" title="${game.i18n.localize("EASYTABLE.ui.dialog.csv.defaultcollection-tooltip")}"><div>${game.i18n.localize("EASYTABLE.ui.dialog.csv.defaultcollection")}</div>
                        <select name="defaultcollection" id="defaultcollection">
                            <option value="Text">Text</option>
                            <option value="Item">Item</option>
                            <option value="Actor">Actor</option>
                            <option value="Scene">Scene</option>
                            <option value="JournalEntry">JournalEntry</option>
                            <option value="Macro">Macro</option>
                            <option value="RollTable">RollTable</option>
                            <option value="Playlist">Playlist</option>
                        </select>
                    </div>
                    <hr/>
                </div>
                `,
                buttons: {
                    generate: {
                        label: game.i18n.localize("EASYTABLE.ui.dialog.csv.button.generate"),
                        callback: async (html) => {
                            let title = html.find('[name="tableTitle"]').val();
                            let description = html.find('[name="tableDescription"]').val();
                            let csvData = html.find('[name="csv"]').val();
                            let separator = html.find('[name="separator"]').val();
                            let defaultCollection = html.find('[name="defaultcollection"').val();
                            console.log(defaultCollection);

                            //TODO: Notify while dialog is still open, allowing changes
                            if (!title) {
                                ui.notifications.error(game.i18n.localize("EASYTABLE.notif.title-required"));
                                return;
                            } else if (!csvData) {
                                ui.notifications.error(game.i18n.localize("EASYTABLE.notif.csv-required"));
                                return;
                            } else if (!separator || separator.length > 1) {
                                //TODO: Restrict this property
                                ui.notifications.error(game.i18n.localize("EASYTABLE.notif.separator-required"));
                                return;
                            }
                            game.settings.set("easyrandomtable", "tableSettings", {
                                title: 'EasyRollTable',
                                description: 'An easy table',
                                data: `val1${separator}val2${separator}val3`,
                                separator: separator || ','
                            });
                            await EasyTable.generateTable(title, description, csvData, separator, defaultCollection);

                            ui.notifications.notify(`${game.i18n.localize("EASYTABLE.notif.table-created")} ${title}`);
                        }
                    },
                    cancel: {
                        label: game.i18n.localize("EASYTABLE.ui.dialog.csv.button.cancel")
                    }
                },
                default: "generate"
            }).render(true);

        })

        // -- Table Paste mode --
        let tableButton = $(`<button class='new-easytable'><i class='fas fa-file-csv'></i> ${game.i18n.localize("EASYTABLE.ui.button-tablepaste-title")}</button>`)
        tableButton.click(function () {
            new Dialog({
                title: game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.title"),
                content: `<div> 
                <div class="form-group"><div>${game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.table-title")}</div><input type='text' name="tableTitle" value="${title}"/></div>
                <div class="form-group"><div>${game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.table-description")}</div><input type='text' name="tableDescription" value=""/></div>
                <div class="form-group" title="${game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.table-data-tooltip")}"><div>${game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.table-data")}</div><textarea class="easytable-textarea" name="tableData"></textarea></div>
                <div class="form-group" title="${game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.safemode-tooltip")}"><div>${game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.safemode")}</div><input type="checkbox" id="safeMode" name="safeMode"></div>
                <hr/>
            </div>
            `,
                buttons: {
                    generate: {
                        label: game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.button.generate"),
                        callback: async (html) => {
                            let title = html.find('[name="tableTitle"]').val();
                            let description = html.find('[name="tableDescription"]').val();
                            let tableData = html.find('[name="tableData"]').val();
                            let safeMode = html.find('[name="safeMode"]')[0].checked

                            if (!title) {
                                ui.notifications.error(game.i18n.localize("EASYTABLE.notif.title-required"));
                                return;
                            } else if (!tableData) {
                                ui.notifications.error(game.i18n.localize("EASYTABLE.notif.tabledata-required"));
                                return;
                            }

                            await EasyTable.generateTablePastedData(title, description, tableData, safeMode);

                            ui.notifications.notify(`${game.i18n.localize("EASYTABLE.notif.table-created")} ${title}`);
                        }
                    },
                    cancel: {
                        label: game.i18n.localize("EASYTABLE.ui.dialog.tablepaste.button.cancel")
                    }
                },
                default: "generate"
            }, {
                resizable: true
            }).render(true);

        });

        let header = `<span class="new-easytable">${game.i18n.localize("EASYTABLE.ui.button-header")}</span><div class="easytable-actions header-actions action-buttons flexrow">
    </div>`;
        $(header).insertAfter(html.find('.directory-header').find('.header-actions'));
        $('.easytable-actions').append(csvButton).append(tableButton);
    }
})

Hooks.once("init", async function () {
    console.log("BHK-ERRT | Initializing The BHK Easy Random Rollable Table Module.");
    let etSettings = {
        title: game.i18n.localize("EASYTABLE.settings.defaults.title"),
        description: game.i18n.localize("EASYTABLE.settings.defaults.description"),
        data: 'val1,val2{2},val3',
        separator: ','
    };
    game.settings.register("easyrandomtable", "tableSettings", {
        name: "EasyRollTable Default Settings",
        scope: "world",
        config: false,
        default: etSettings
    });

    const base = RollTableDirectory.prototype._getEntryContextOptions;
    RollTableDirectory.prototype._getEntryContextOptions = function () {
        const entries = game.user.isGM ? base.call(this) : [];
        entries.push({
            name: game.i18n.localize('EASYTABLE.ui.context.export'),
            icon: '<i class="fas fa-file-csv"></i>',
            condition: game.user.isGM,
            callback: EasyTable.exportTableToCSV,

        });
        return entries;
    };
});


