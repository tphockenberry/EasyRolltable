export const registerSystemSettings = function () {

    const module = "easyrandomtable";
    const defaultDataSeparator = ";";

    game.settings.register(module, "dataSeparator", {
        name: "SETTINGS.dataSeparator",
        hint: "SETTINGS.dataSeparatorDescription",
        scope: "world",
        config: true,
        default: defaultDataSeparator
    });

    let etSettings = {
        title: game.i18n.localize("EASYTABLE.settings.defaults.title"),
        description: game.i18n.localize("EASYTABLE.settings.defaults.description"),
        data: 'val1,val2{2},val3',
        separator: game.settings.get(module, "dataSeparator") ?? defaultDataSeparator
    };

    game.settings.register(module, "tableSettings", {
        name: "EasyRollTable Default Settings",
        scope: "world",
        config: false,
        default: etSettings
    });

}