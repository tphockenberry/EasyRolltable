import {EasyTable} from "../src/modules/EasyTable.js";
import {FvttProvider} from "../src/modules/fvttProvider.js";
import {jest} from "@jest/globals";

let tableWithNumber = `1. Pain et jambon Δ4
2. Biscuits secs et noix Δ8`;

let fullTableWithNumber = `1. Pain et jambon Δ4, sac en tissu déchiré, chaussette remplie de cailloux
2. Biscuits secs et noix Δ8, vieille besace, couverture, corde Δ10, chapeau de pèlerin
3. Pot de soupe aux escargots Δ6, bœuf de trait Δ8, tapis roulé, 2 sacs Δ4, pied-de-biche
4. Navets bouillis au beurre Δ6, sacoches vides Δ6, sac de couchage, 2 pièges à ours
5. Saucisse au foie et à la tomate Δ4, torches Δ6, outils de voleur de cadavres, pitons Δ6
6. Fèves et viande séchée Δ8, outils de calligraphe Δ8, symbole sacré Δ6, lanterne et huile Δ8
7. Lapins fraîchement pris Δ4, pièges, sac de couchage, bougies Δ4, jeu de dés
8. Pommes séchées Δ8, chien de berger Δ6, vieux havresac Δ6, tente Δ10, torches Δ6
9. Pain de campagne et poisson salé Δ8, grand filet, lettre de marque, menottes
10. Farine de haricots et mouton séché Δ4, vieux canasson Δ6, manteau de pluie, torches Δ6
11. Terrine de sanglier et bière Δ6, eau bénite Δ6, outils d’alchimiste Δ8, bougies Δ4
12. Chou farci au canard Δ6, sac de charbon, canne à pêche, jeu de cartes
13. Pain frais et fruits Δ6, lampe, huile Δ4, carte des environs, pelle, échelle de corde
14. Poule dans une cage Δ6, sac de couchage, torches Δ6, ustensiles de cuisine, jeu de tarot
15. Boudin noir et vin bouchonné Δ6, outils de serrurier Δ8, havresac Δ8, lanterne et huile Δ8
16. Gâteaux au miel et au citron Δ4, vêtements de voyage raffinés, cheval de guerre Δ10, ingrédients magiques Δ6
17. Tourte à la loutre Δ6, outils de courtisan Δ8, cape de qualité, oiseau chanteur en cage
18. Gâteaux de poisson et vin sec Δ6, sac de café Δ8, outils d’arnaqueur, corde Δ10, dés pipés
19. Repas en conserve Δ8, outils de calligraphe Δ8, chapeau de magicien, lorgnette, ingrédients magiques Δ8
20. Fromage poivré et cidre Δ4, étalon de race Δ10, outils de cartographe Δ8, torches Δ6`;

let tableWithRanges = `01 The ground shakes violently and a massive fissure opens 
02-03 An unseen foe leaps out of hiding at close range
04-05 A horrible buzzing fills the air, growing louder and louder 
06-07 You catch the acrid smell of smoke and flame
08-09 A bright star appears in the sky, visible even at midday 
10-11 You spot a half-open bag with gold coins glinting inside 
12-13 A man slips a note and an odd potion into your hand
14-15 Someone observing you from afar steps out of sight 
16-17 A dwarf in a red hat hands you a rose, bows, and leaves 
18-19 A cowled stranger in a black cloak approaches you
20-21 Someone tries to pick your pocket
22-23 A strange ticking sound comes from inside your bag
24-25 A frothing, frantic horse with a saddle but no rider appears 
26-27 A mound in the earth quickly burrows toward you
28-29 You sense you are being magically scryed upon
30-31 Someone tries to plant an object on your person
32-33 You are filled with a strong sense of dread and danger 
34-35 A woman hands you a black cat and then runs away
36-37 A small, woodland creature jumps out of a backpack
38-39 You smell lilacs and hear faint, ghostly laughter
40-41 A note wrapped around a thin dagger lands next to you 
42-43 A green-glowing meteor streaks through the sky
44-45 Someone nearby is staring at you and mouthing words`

const fullTableWithoutNumber = `Torch
Dagger
Pole
Shortbow and 5 arrows
Rope, 60'
Oil, flask
Crowbar
Iron spikes (10)
Flint and steel
Grappling hook
Club
Caltrops (one bag)`;

test('computeResults from a random table data with number', () => {
    let result = EasyTable.computeResults(fullTableWithNumber);
    expect(result.length).toBe(20);
    expect(result[0].text).toBe("Pain et jambon Δ4, sac en tissu déchiré, chaussette remplie de cailloux");
    expect(result[0].weight).toBe(1);
});

test('computeResults from a random table data without number', () => {
    let result = EasyTable.computeResults(fullTableWithoutNumber);
    expect(result.length).toBe(12);
    expect(result[0].text).toBe("Torch");
    expect(result[0].weight).toBe(1);
});

test('computeResults from a random table data without number', () => {
    let result = EasyTable.computeResults(tableWithRanges);
    expect(result.length).toBe(23);
    expect(result[0].text).toBe("The ground shakes violently and a massive fissure opens");
    expect(result[0].weight).toBe(1);
    expect(result[1].text).toBe("An unseen foe leaps out of hiding at close range");
    expect(result[1].weight).toBe(2);
});

test('_getDataRows from a random table data with number', () => {
    expect(EasyTable._getDataRows(tableWithRanges).length).toBe(23);
});

test('_getDataRows from a random table data with number', () => {
    expect(EasyTable._getDataRows(fullTableWithNumber).length).toBe(20);
});

test('_getDataRows from a random table data without number', () => {
    expect(EasyTable._getDataRows(fullTableWithoutNumber).length).toBe(12);
});

test('_deleteTrailingEmptyLine from a random table data with one trailing line with cartridge return', () => {
    let tableEntries = ["1. Pain", "2. Épée courte", "\r\n"];
    expect(EasyTable._deleteTrailingEmptyLine(tableEntries).length).toBe(2);
});

test('_deleteTrailingEmptyLine from a random table data with one trailing line', () => {
    let tableEntries = ["1. Pain", "2. Épée courte", "\n"];
    expect(EasyTable._deleteTrailingEmptyLine(tableEntries).length).toBe(2);
});

test('_deleteTrailingEmptyLine from a random table data with two trailing lines', () => {
    let tableEntries = ["1. Pain", "2. Épée courte", "\n", "\n"];
    expect(EasyTable._deleteTrailingEmptyLine(tableEntries).length).toBe(2);
});

test('_deleteTrailingEmptyLine from a random table data with no trailing line', () => {
    let tableEntries = ["1. Pain", "2. Épée courte"];
    expect(EasyTable._deleteTrailingEmptyLine(tableEntries).length).toBe(2);
});

describe('getCollection with a collection not present in the valid collection should return empty string', () => {
    it.each(
        ["unknown", null, undefined, "", "     "]
    )("collection is '%s'", (collection) => {
        expect(EasyTable._getCollection(collection)).toBe("");
    });
});
test('getCollection with a collection not present in the valid collection should return empty string', () => {
    expect(EasyTable._getCollection("unknown")).toBe("");
});

describe('getCollection with a collection present in the valid collection should return the collection string', () => {
    it.each(EasyTable.validCollection)
    ("collection is '%s'", (collection) => {
        expect(EasyTable._getCollection(collection)).toBe(collection);
    });
});

jest.mock("../src/modules/fvttProvider.js");
test('getResultId with an actor name should return its id and image', () => {
    const mockResult = {
        id: 1,
        img: "aboleth.jpg"
    };
    FvttProvider._getEntity = jest.fn().mockReturnValue(mockResult)
    let result = EasyTable.getResultId("Actor", "Aboleth");
    expect(result.id).toBe(1);
    expect(result.img).toBe("aboleth.jpg");
});