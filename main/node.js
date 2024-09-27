const{app,BrowserWindow,ipcMain} = require("electron")
var fs = require("fs")
var prc = require("child_process")

function popout(bounds,page,callback){
    var path = __dirname.split("\\")
    path.pop()

    var win = new BrowserWindow({
        width: bounds[0],
        height: bounds[1],
        transparent: true,
        frame: false,
        show: true,
        useContentSize: true,
		autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: __dirname + "/preload.js",
            sandbox: true
        },
        icon: path.join("/") + "/resources/paint.ico"
    })

    win.loadFile([...__dirname.split("/").slice(0,-1),...[page]].join("/"))

    if (callback){
        win.once("ready-to-show",()=>{
            callback(win)
        })
    }
        
    ipcMain.on("minimize",()=>{
        BrowserWindow.getFocusedWindow().minimize()
    })

    ipcMain.on("maximize",()=>{
        var f = BrowserWindow.getFocusedWindow()
        
        if(f.isFullScreen())
            f.setFullScreen(false)
        else 
            f.setFullScreen(true)
    })
        
    ipcMain.on("close",() => {
        BrowserWindow.getFocusedWindow().close()
    })

    ipcMain.on("popout",(events,args) => {
        popout([400,220], args[0], args[1])
    })

    ipcMain.on("reboot",() => {
        app.relaunch()
    	app.exit(0)
    })
}

async function main(){
    popout([950,550],"index.html",(win) => {
        ipcMain.on("init",()=>{})
        //win.on("resize",()=>{})
    })
}

app.on("ready",main)