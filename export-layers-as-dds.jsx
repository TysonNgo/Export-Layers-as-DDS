/**
 * @file
 * This is a script that exports each top level layer as a .dds file.
 * The exported files will be located in the same directory as the active document.
 *
 * Top level layers that have a name ending with .dxt1 or .dxt5 will be exported.
 * Top level layers starting with "_" will be included in all exports (useful for filter layers)
 *
 * Note: Photoshop CS5 was used.
 */

const DXT1 = 0; // 1st option in the drop-down -> DXT1 RGB 4 bpp | no alpha
const DXT5 = 3; // 4th option in the drop-down -> DXT5 ARGB 8 bpp | interpolated alpha
var topLevelLayers = app.activeDocument.layers;
var documentDirectory = activeDocument.path.fsName;

var console = {log: function(s){$.writeln(s)}};

/**
 * @function isolateVisibility
 * @description makes a layer in the top level the only visible layer along with any
 * other layer starting with "_"
 *
 * @param {LayerSet} layer The layer or group in the top level to isolate visibility
 * @return {undefined}
 */
function isolateVisibility(layer){
    for (var i=0;i<topLevelLayers.length; i++){
        var _layer = topLevelLayers[i];
        // ignore layers starting with "_"
        if (/^_/.test(_layer.name[0])) continue;
        if (_layer.visible){
            _layer.visible = false;
        }
    }
    layer.visible = true;
};

/**
 * @function saveAsDDS
 * @description saves the active document as .dds
 *
 * @param {number} DXT determines if the exported dds is DXT1 or DXT5.
 * 0 = DXT1; 3 = DXT5
 * @param {string} outfile The path of the output file. 
 * @return {undefined}
 */
function saveAsDDS(DXT, outfile){
    var idsave = charIDToTypeID( "save" );
        var saveAs = new ActionDescriptor();
        var idAs = charIDToTypeID( "As  " );
            var saveType = new ActionDescriptor();
            var dxtOption = charIDToTypeID( "txfm" );
            saveType.putInteger( dxtOption, DXT );
        var idNVIDIADthreeDDDS = stringIDToTypeID( "NVIDIA D3D/DDS" );
        saveAs.putObject( idAs, idNVIDIADthreeDDDS, saveType );
        var idIn = charIDToTypeID( "In  " );
        saveAs.putPath( idIn, new File( outfile) );
    executeAction( idsave, saveAs, DialogModes.NO );
};

/**
 * @function isExportable
 * @description checks if layer is exportable.
 * layer is exportable is if the layer name ends with ".dxt1" or ".dxt5"
 *
 * @param {LayerSet} layer A layer or group in the top level
 * @return {boolean}
 */
function isExportable(layer){
    return /.*?\.(dxt[15])$/.test(layer.name);
};

function exportAll(){
    for (var i=0;i<topLevelLayers.length; i++){
        var layer= topLevelLayers[i];
        if (isExportable(layer)){
            isolateVisibility(topLevelLayers[i]);
            var filename = layer.name.substr(0, layer.name.length-5);
            var dxtType = layer.name.substr(layer.name.length-4);
            filename = filename + '.dds';
            if (dxtType === 'dxt1'){
                saveAsDDS(DXT1, documentDirectory + '\\' + filename);
            } else if (dxtType === 'dxt5'){
                saveAsDDS(DXT5, documentDirectory + '\\' + filename);
            }
        }
    }
};

exportAll();