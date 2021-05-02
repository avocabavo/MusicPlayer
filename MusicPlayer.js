// MusicPlayer.js

const slashOrBack= /\/|\\/
const audioFormats= ['.mp3']
const displayStates= Object.freeze({
  'none': 1,
  'some': 2,
  'all': 3
})

var app
var thePlayer

class DirNode {
  constructor(name, parent) {
    this.name= name
    this.parent= parent

    this.dirs= {}
    this.tracks= {}
    this.dirArray= []
    this.trackArray= []

    this.displayToggle= true
    this.displayCalced= displayStates.all
  }
}

class TrackNode {
  constructor(file, parent) {
    this.name= file.webkitRelativePath.split(slashOrBack).slice(-1)[0]
    this.file= file
    this.parent= parent

    this.displayToggle= true
  }
}

$(()=> {
  thePlayer= $('#the-player')[0]

  Vue.component('track-tree', {
    // template: '#track-tree-template',
    template: '#track-tree-template',
    props: ['name', 'dirArray', 'trackArray'],
  })
  
  app= new Vue({
    el: '#app',
    data: {
      library: new DirNode('Library', null),
    },
    methods: {
      openFolder() {
        console.log('in the openFolder function')
        let folderInput= $('#folder-input')[0]
        let files= folderInput.files
        for (file of files) {
          if (audioFormats.some(af=> file.name.endsWith(af))) {
            let path= file.webkitRelativePath.split(slashOrBack).slice(0, -1)
            let fileName= file.webkitRelativePath.split(slashOrBack).slice(-1)[0]
            let subLibrary= app.library
            for (pathPart of path) {
              if (!(pathPart in subLibrary.dirs)) {
                subLibrary.dirs[pathPart]= new DirNode(pathPart, subLibrary)
              }
              subLibrary= subLibrary.dirs[pathPart]
            }
            subLibrary.tracks[fileName]= new TrackNode(file, subLibrary)
          }
        }
        folderInput.value= null
        app.forgeLibraryArrays(app.library)
      },
      forgeLibraryArrays(subLibrary) {
        todo= [subLibrary]
        while (todo.length > 0) {
          node= todo.pop()
          node.dirArray= []
          node.trackArray= []
          for (dirName in node.dirs) {
            node.dirArray.push(node.dirs[dirName])
            todo.push(node.dirs[dirName])
          }
          for (trackName in node.tracks) {
            node.trackArray.push(node.tracks[trackName])
          }
        }
      },
      setTrack(file) {
        thePlayer.src= URL.createObjectURL(file)
      },
    },
  })

  // folderInput.onchange= ()=> {
  //   app.openFolder()
  //   // let files= folderInput.files
  //   // for (file of files) {
  //   //   if (audioFormats.some(af=> file.name.endsWith(af))) {
  //   //     let path= file.webkitRelativePath.split(slashOrBack).slice(0, -1)
  //   //     let fileName= file.webkitRelativePath.split(slashOrBack).slice(-1)[0]
  //   //     for (pathIndex in path) {
  //   //       let prePath = path.slice(0, pathIndex)
  //   //       let subLibrary = library
  //   //       for (prePathPart of prePath) {
  //   //         subLibrary= subLibrary[prePathPart]
  //   //       }
  //   //       if (!(path[pathIndex] in subLibrary)) {
  //   //         subLibrary[path[pathIndex]]= {}
  //   //       }
  //   //     }
  //   //     let subLibrary= library
  //   //     for (pathPart of path) {
  //   //       subLibrary= subLibrary[pathPart]
  //   //     }
  //   //     subLibrary[fileName]= file
  //   //   }
  //   // }
  //   // folderInput.value = null
  // }
})
