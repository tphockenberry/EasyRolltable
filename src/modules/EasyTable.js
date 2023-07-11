class EasyTable {

    static _getDataRows(tableData) {
        return tableData.split(/\n(?=\d*[.\-–+\t]*)/g);
    }

    static _deleteTrailingEmptyLine(tableEntries) {
        return tableEntries.filter(entry => !entry.match("^(\n|\r\n)$"))
    }

    static _sanitize(tableData) {
        let rows = this._getDataRows(tableData);

        let resultData = "";

        rows.forEach(row => {
            row = row.replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/, '');
            resultData += row + "\n";
        });
        return resultData;
    }

    static getCollection(collection) {
        let validCollection = ['Actor', 'Scene', 'Macro', 'Playlist', 'JournalEntry', 'RollTable', 'Item']
        if (validCollection.includes(collection)) {
            return collection
        }
        return '';
    }

    static getResultId(collection, text) {
        let resultId = '';
        let img = 'icons/svg/d20-black.svg'
        if (collection === 'Text' || !collection) {
            return [resultId, img];
        }
        let entity;
        switch (collection) {
            case 'Actor':
                entity = game.actors.getName(text);
                resultId = entity?.id || ''
                img = entity?.img || img;
                break;
            case 'Scene':
                entity = game.scenes.getName(text);
                resultId = entity?.id || ''
                img = entity?.img || img;
                break;
            case 'Macro':
                entity = game.macros.getName(text);
                resultId = entity?.id || ''
                img = entity?.data?.img || img;
                break;
            case 'Playlist':
                entity = game.playlists.getName(text);
                resultId = entity?.id || ''
                // img = entity?.img||img;
                break;
            case 'JournalEntry':
                entity = game.journal.getName(text);
                resultId = entity?.id || ''
                img = entity?.data?.img || img;
                break;
            case 'RollTable':
                entity = game.tables.getName(text);
                resultId = entity?.id || ''
                img = entity?.data?.img || img;
                break;
            case 'Item':
                entity = game.items.getName(text);
                resultId = entity?.id || ''
                img = entity?.img || img;
                break;
            default:
                break;
        }
        return [resultId, img];
    }

    static async generateTable(title, description, csvData, separator, defaultCollection = 'Text') {
        let resultsArray = [];
        let csvElements = csvData.split(separator);
        let rangeIndex = 1;
        csvElements.forEach((csvElement, i) => {
            let [text, opts] = csvElement.split('{');
            let weight;
            let collection = defaultCollection;
            if (opts) {
                opts = opts.split('}')[0];
                [weight, collection] = opts.split('@');
                weight = parseInt(weight);
            }
            if (!weight || weight < 1) {
                weight = 1;
            }
            let type = 1;
            let resultCollection = EasyTable.getCollection(collection);
            let [resultID, img] = EasyTable.getResultId(resultCollection, text);
            if (!resultID || resultID.length < 1) {
                resultCollection = '';
                type = 0;
            }
            resultsArray.push({
                "type": type,
                "text": text,
                "weight": weight,
                "range": [rangeIndex, rangeIndex + (weight - 1)],
                "collection": resultCollection,
                "resultId": resultID,
                "drawn": false,
                "img": img
            });
            rangeIndex += weight;
        });

        let table = await RollTable.create({
            name: title,
            description: description,
            results: resultsArray,
            replacement: true,
            displayRoll: true,
            img: "modules/easyrandomtable/assets/easytable.png"
        });
        await table.normalize();
    }

    static async generateTablePastedData(title, description, data, safeMode = false) {

        let resultsArray = this.computeResults(data, safeMode);

        let table = await RollTable.create({
            name: title,
            description: description,
            results: resultsArray,
            replacement: true,
            displayRoll: true,
            img: "modules/easyrandomtable/assets/easytable.png"
        });
        await table.normalize();
    }

    static computeResults(data, safeMode) {
        let sanitizedData = data;
        if (!safeMode) {
            sanitizedData = this._sanitize(data);
        }

        let resultsArray = [];
        let processed = [];
        let rawTableEntries = sanitizedData.split(/[\r\n]+/);
        let tableEntries = this._deleteTrailingEmptyLine(rawTableEntries);
        let rangeIndex = 1;
        tableEntries.forEach((tableEntry, i) => {
            if (processed[i]) {
                return;
            }
            processed[i] = true;
            tableEntry = tableEntry.trim();
            if (tableEntry.length < 1) {
                return;
            }
            let weight, text;
            if (tableEntry.match(/^\d/)) {
                [weight, text] = tableEntry.split(/(?<=^\S+)\s/);
                try {
                    if (weight.match(/\d+[-|–]\d+/)) {
                        let [beginRange, endRange] = weight.split(/[-–]/);
                        if (endRange === '00') {
                            endRange = '100'
                        }
                        weight = endRange - beginRange + 1;
                    } else {
                        weight = 1;
                    }
                    if (!text) {
                        // Likely in a linebreak-based table
                        while (!text && i < tableEntries.length - 1) {
                            let index = ++i;
                            processed[index] = true;
                            text = tableEntries[index].trim();
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                text = tableEntry;
            }
            if (!text) {
                text = "TEXT MISSING";
            }
            if (!weight || weight < 1) {
                weight = 1;
            }
            weight = parseInt(weight);
            resultsArray.push({
                "type": 0,
                "text": text,
                "weight": weight,
                "range": [rangeIndex, rangeIndex + (weight - 1)],
                "drawn": false
            });
            rangeIndex += weight;
        });
        return resultsArray;
    }

    static async exportTableToCSV(li) {

        let {separator, skipWeight, skipCollection} = await new Promise((resolve) => {
            new Dialog({
                title: game.i18n.localize('EASYTABLE.ui.dialog.export.separator.title'),
                content: `<table style="width:100%"><tr><th style="width:50%"><label>${game.i18n.localize('EASYTABLE.ui.dialog.export.separator.prompt')}</label></th><td style="width:50%"><input type="text" maxlength="1" size="1" value="," name="separator"/></td></tr>
                <tr><th style="width:50%"><label>${game.i18n.localize('EASYTABLE.ui.dialog.export.separator.skip-weight')}</label></th><td style="width:50%"><input type="checkbox" id="skipWeight" name="skipWeight"></td></tr>
                <tr><th style="width:50%"><label>${game.i18n.localize('EASYTABLE.ui.dialog.export.separator.skip-collection')}</label></th><td style="width:50%"><input type="checkbox" id="skipCollection" name="skipCollection"></td></tr>
                </table>`,
                buttons: {
                    Ok: {
                        label: game.i18n.localize('EASYTABLE.ui.dialog.export.separator.button-ok'),
                        callback: (html) => {
                            resolve({
                                separator: html.find("[name='separator']").val(),
                                skipWeight: html.find("[name='skipWeight']")[0].checked,
                                skipCollection: html.find("[name='skipCollection']")[0].checked
                            });
                        }
                    }
                }
            }).render(true);
        });
        if (!separator) {
            separator = ',';
        }
        let results = game.tables.get(li.data("entityId")).data.results
        let output = '';
        let index = 0;
        let separatorIssue = false;
        for (let result of results) {
            let {
                weight,
                text,
                type,
                collection
            } = result.data;
            // If an entry is empty, ensure it has a blank string, and remove the entity link
            if (!text) {
                text = '';
                type = 0;
            }
            // Mark issues with chosen separator
            if (text.indexOf(separator) > -1) {
                separatorIssue = true;
            }
            output += text;

            // Handle skips
            if (skipWeight) {
                weight = 1;
            }
            if (skipCollection) {
                type = 0;
            }

            if (weight > 1) {
                output += `{${weight}${type === 1 && collection ? `@${collection}` : ''}}`
            } else if (type === 1 && collection) {
                output += `{@${collection}}`;
            }
            if (++index <= results.size - 1) {
                output += separator;
            }
        }
        new Dialog({
            title: game.i18n.localize('EASYTABLE.ui.dialog.export.output.title'),
            content: `${separatorIssue ?
                `<h3 style="color:#ff0000">
                ${game.i18n.localize('EASYTABLE.ui.dialog.export.output.separator-issue-head')}
                </h3>
                <p>
                ${game.i18n.localize('EASYTABLE.ui.dialog.export.output.separator-issue-hint')}
                </p>`
                :
                `<h2>
                ${game.i18n.localize('EASYTABLE.ui.dialog.export.output.separator-issue-none')}
                </h2>`}
                <textarea class="easytable-textarea" style="height:300px">${output.trim()}</textarea>`,
            buttons: {
                Copy: {
                    label: game.i18n.localize('EASYTABLE.ui.dialog.export.output.button-copy'),
                    callback: (html) => {
                        html.find('textarea').select();
                        document.execCommand('copy');
                    }
                },
                Close: {
                    label: game.i18n.localize('EASYTABLE.ui.dialog.export.output.button-close')
                }
            }
        }).render(true);
    }
}

module.exports = EasyTable;

