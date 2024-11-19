export class FvttProvider {

    static _getEntity(collection, text) {
        let entity;
        switch (collection) {
            case 'Actor':
                entity = game.actors.getName(text);
                break;
            case 'Scene':
                entity = game.scenes.getName(text);
                break;
            case 'Macro':
                entity = game.macros.getName(text);
                break;
            case 'Playlist':
                entity = game.playlists.getName(text);
                break;
            case 'JournalEntry':
                entity = game.journal.getName(text);
                break;
            case 'RollTable':
                entity = game.tables.getName(text);
                break;
            case 'Item':
                entity = game.items.getName(text);
                break;
            default:
                break;
        }
        return entity;
    }
}