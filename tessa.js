const tesseract =           require( 'node-tesseract-ocr' );
const path =                require( 'path' );
const fs =                  require( 'fs' );
const ts =                  new Date( );
const tsf =                 [ 
                                ts.getMonth( ) + 1  ,
                                ts.getDate( )       ,
                                ts.getFullYear( )   ,
                                ts.getHours( )      ,
                                ts.getMinutes( )    ,
                                ts.getSeconds( )    ,
                            ]
                    .join( '-' );
// MAKE SURE THAT C/PROGFILES/TESSA IS IN PATH IN ENV VARS
            /*      PLACE
                   THE
                  IMAGES
                 YOU'D
                LIKE
               TO
              CONVERT
             INTO
            THIS      */
const imagesListDirectory =     path.dirname( './' );
  /*      SAME
         DIRECTORY
        (NEXT
       TO
      TESSA.JS,
     THIS
    FILE)
   */   
const writeTextToLogFile =      path.join( imagesListDirectory , 'textFromImages' + tsf + '.csv' );
const allFilesFromDir =         fs.readdirSync( imagesListDirectory );
const filteredForImages =       allFilesFromDir
                                    .filter( f => ( 
                                        // /\.eps/i.test( f ) ||
                                        /\.gif/i.test( f ) ||
                                        /\.jpg/i.test( f ) ||
                                        // /\.pdf/i.test( f ) ||
                                        /\.png/i.test( f ) ||
                                        /\.svg/i.test( f )
                                    ) );
const imagesFullPaths =         filteredForImages
                                    .map( m => (
                                        path.join( imagesListDirectory , m )
                                    ) );
const config = {
    lang        :       "eng"   ,
    oem         :       1       ,
    psm         :       3       ,
};


console.log( imagesFullPaths )


tesseract
.recognize( imagesFullPaths , config )
.then( text => {
    console.log( 'Result : \n' , text );
    let forCsv = text
                    .split( '\n' )
                    .filter( f => ( 
                        f.length > 0 && /[A-Za-z0-9\S]/.test( f ) 
                    ) );

    fs.writeFileSync( writeTextToLogFile , forCsv.map( ( m , i ) => ( i + ',' + m ) ).join( '\n' ) );
} )
.catch( error => {
    console.log( error.message );
} );