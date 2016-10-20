/*
  opinel.js

  A bunch of useful small functions & shortcuts for JavaScript.
  Use at your own risk. See the file ./LICENSE

  Guillaume Lathoud, 2016
  glat@glat.info
*/

/* getters: pure functions */

function get( /*string | array*/vname, /*?object?*/obj )
/*
  Get a value within an object, possibly deep (`vname` can be a dotted
  string).


  Example: from a local object
  
  `get( 'a.b.c', { a : { b : { c : 42 } } } ) )`


  Examples: from the global name space

  ```
  get( 'a' );
  get( 'a.b.c' );
  get( [ 'a' ] );
  get( [ 'a', 0, 'c' ] );
  ```

*/
{
    obj  ||  (obj = this);
    var arr = vname instanceof Array  ?  vname  :  vname.split( '.' )
    ,     v = obj[ arr[ 0 ] ]
    ;
    return arr.length < 2  ||  v == null  ?  v  :  get( vname.slice( 1 ), v );
}

function getWait( /*string | array*/vname, /*?object?*/obj, /*?integer?*/interval_ms )
/*

  Waits for a value to be `!= null`, as delivered by `get( vname,
objx)`.

Example:

```
getWait( 'a.b.c' )( callback )

function callback( value ) { do_something_with( value ); } 
```

Many callbacks: `getWait( 'a.b.c' )( cb1 )( cb2 )( cb3 )`
(called in a random order).

*/
{
    obj  ||  (obj = this);
    interval_ms != null  ||  (interval_ms = 123);

    return callback_eater;

    function callback_eater( /*function*/callback )
    {
        setTimeout( check, 0 );

        return callback_eater; // In case one wants to eat more callbacks
        
        function check()
        {
            var v = get( vname, obj );
            if (v != null)
                callback( v );
            else
                setTimeout( check, interval_ms );
        }
    }
}

function loadWait( /*string*/src, /*string | array*/vname, /*?object?*/obj, /*?integer?*/interval_ms )
/*

  Makes sure to have loaded or be loading the script at URL `src`,
  then returns `getWait( vname, obj, interval_ms)`.

*/
{
    if (!get( vname, obj )  &&  !loadWait[ src ])
    {
        loadWait[ src ] = 1;
        aC( document.head
            , sA( cE( 'script' )
                  , { type : 'text/javascript'
                      , src : src
                    }
                )
          );
    }
    return getWait( vname, obj, interval_ms );
}

function gA( aname, /*?*/node )
{
    return (node  ||  document).getAttribute( aname );
}

function gEBCN( cname, /*?*/node )
{
    return (node  ||  document).getElementsByClassName( cname );
}

function gEBI( id, /*?*/node )
{
    return node  ?  qS( '#' + id, node )  :  document.getElementById( id );
}

function gEBTN( tname, /*?*/node ) 
{
    return (node  ||  document).getElementsByTagName( tname );
}

function gScrollTop( node )
{
    return node  &&  node.offsetParent
	?  (node.offsetTop)  +  gScrollTop( node.offsetParent )
	:  0
    ;
}

function idf( x )
{
    return x;
}

function qS( sel, /*?*/node )
{
    return (node  ||  document).querySelector( sel );
}

function qSA( sel, /*?*/node )
{
    return (node  ||  document).querySelectorAll( sel );
}

/* html getters */

function hh( /*string, e.g. 'div' or 'div class="myclass"'*/tname, /*?string | array of string?*/html /*... maybe more `html` arguments... */) 
{
    if (arguments.length > 2)
        html = Array.prototype.slice.call( arguments, 1 );
    
    html = array_2_string( html );

    var tag = tname.replace( /\s[\S\s].*$/, '' ).replace( /^\s*|\s*$/g, '' );
    
    // detect HTML5 void elements: 
    // http://www.w3.org/TR/html5/syntax.html#void-elements
    // http://stackoverflow.com/a/7854998

    return tag in { area:1, base:1, br:1, col:1, embed:1, hr:1, img:1, input:1, 
                    keygen:1, link:1, meta:1, param:1, source:1, track:1, wbr:1 }
        ?  '<' + tname + '>'
	:  '<' + tname + '>' + (html  ||  '') + '</' + tag + '>'
    ;

    function array_2_string( x )
    {
        return x  &&  'string' !== typeof x
            ?  x.map( array_2_string ).join( '' )
            :  x
        ;
    }
}

hh.esc = function (s) 
// If this is used too often, then it is probably better to switch
// over to js.yak
{
    return s
        .replace( /&/g, '&amp;' )            
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )            
        .replace( /"/g, '&quot;' )
        .replace( /'/g, '&apos;' );
};


/* Note: functions are objects, so we can define convenient shortcuts
 * e.g. `hh.div( <html> )`, `hh.span( <html> )` etc.
 */
[ 'a', 'blockquote', 'button', 'cite', 'code', 'dd', 'div', 'dl', 'dt'
  , 'em', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  , 'hr', 'iframe', 'img', 'input', 'li', 'ol', 'option', 'p', 'pre'
  , 'select', 'span', 'strong'
  , 'table', 'td', 'th', 'tr', 'ul' 
]
    .forEach( function ( name ) { hh[ name ] = hh.bind( null, name ); } )
;

/* creators */

function cE( name, /*?*/node )
{
    return (node  ||  document).createElement( name );
}

function cTxN( text, /*?*/node )
{
    var ret = (node  ||  document).createTextNode( text );
    return ret;
}

/* getter-setters */

function gs( pname, obj, code )
{
    return pname in obj  ?  obj[ pname ]  :  (obj[ pname ] = run( 'return ' + code, obj ));
}

/* modifiers: setters returning their first parameter */

aC = many_arg_f_gen( function aC_one( node, child ) { 
    node.appendChild( child );
    return node;
});

rC = many_arg_f_gen( function aC_one( node, child ) { 
    node.removeChild( child );
    return node;
});

function many_arg_f_gen( f )
{
    return many_arg_f;
    function many_arg_f( a, b )
    {
        var ret = f( a, b )
        ,     n = arguments.length
        ;
        if (n > 2)
        {
            for (var i = 2; i < n; i++)
                ret = f( a, arguments[ i ] );
        }
        return ret;
    }
}    

aEL = flexible_arg1_f_gen( function aEL_one_ename( node, /*string*/ename, clientfun, /*?*/capture ) {
    (node  ||  document).addEventListener( ename, clientfun, capture );
});

rA = flexible_arg1_f_gen( function rA_one_name( node, /*string*/aname ) {
    node.removeAttribute( aname );
    return node;
});

sA = flexible_arg1_f_gen( function sA_one_name( node, /*string*/aname, value ) {
    
    var v = '' + value;
    if (v !== node.getAttribute( aname ))
        node.setAttribute( aname, v );
    
    return node;
});

sP = flexible_arg1_f_gen( function sP_one_name( node, /*string*/propname, value ) {
    
    if (value !== node[ propname ])
        node[ propname ] = value;
    
    return node;
});

function flexible_arg1_f_gen( f )
{
    return flexible_arg1_f;
    function flexible_arg1_f( node, /*array | object | basic_type*/arg1 /*, ... maybe more params ... */ )
    {
        var _emptyObj = {}
        ,  ret
        ;
        
        if (typeof arg1 === 'object')
        {
            var rest_param = Array.prototype.slice.call( arguments, 2 );
            
            if (typeof arg1.forEach === 'function')
                arg1.forEach( x => ret = f.apply( this, [ node, x ].concat( rest_param ) ) );
            else
                for (var x in arg1) { if (!(x in _emptyObj)) {
                    ret = f.apply( this, [ node, x, arg1[ x ] ].concat( rest_param ) );
                }}
        }
        else
        {
            ret = f.apply( this, arguments );            
        }

        return ret;
    }
}

/* other */

function and( arr )
{
    var a = true;
    for (var n = arr.length, b = 0; b < n; b++)
    {
        a = arr[ b ];
	if (!a)
            break;
    }
    return a;
}

function or( arr )
{
    var a = false;
    for (var n = arr.length, b = 0; b < n; b++)
    {
        var a = arr[ b ];
	if (a)
            break;
    }
    return a;
}

function oCreateMix( a, b /*, ... more ...*/ )
// Similar to `oMix`, but does *not* modify `a`.
// Instead, returns a new object.
//
// (purely functional)
{
    return oMix.apply( null, [ Object.create( a ) ].concat( Array.prototype.slice.call( arguments, 1 ) ) );
}

function oEquals( a, b )
{
    if (a === b) return true;

    var ta = typeof a
    ,   tb = typeof b
    ;
    if (ta !== tb) return false;

    // Basic types 

    if ('number' === ta  && isNaN( a )) return isNaN( b );

    if (ta !== 'object') return a === b;
    
    // null objects

    if (a === null  ||  b === null)  return a === b;

    // non-null objects

    var a_is_arr = a instanceof Array
    ,   b_is_arr = b instanceof Array
    ;
    if (a_is_arr !== b_is_arr) return false;
    
    if (a_is_arr)
    {
        if (a.length !== b.length)  return false;
        for (var i = a.length; i--;) 
            if (!oEquals( a[ i ], b[ i ] ))  return false;
    }
    else
    {
        for (var k in a)  if (!(k in b))  return false;
        for (var k in b)  if (!(k in a  &&  oEquals( a[ k ], b[ k ] )))  return false;
    }
    
    return true;
}

function oMix( a, b /*, ... more ... */ )
// Modify `a` in-place and return it.
{
    for (var n = arguments.length
         , i = 1; i < n; i++)
    {
        var other = arguments[ i ];
        if (other)
        {
            for (var k in other)
                a[ k ] = other[ k ];
        }
    }
    return a;
}

function pad( s, n, c )
{
    c  ||  (c = ' ');
    'string' === typeof s  ||  (s = '' + s);

    var missing = Math.round( (n - s.length) / c.length );
    if (missing > 0)
    {
        var arr = arr  ||  s.split( '' ).reverse();
        while (missing--)
            arr.push( c );
        
        return arr.reverse().join( '' );
    }
    
    return s;
}

function parseJS( /*string*/jscode )
// A bit more flexible than JSON.parse
{
    return new Function( 'return ' + jscode )();
}

function fun( /*string*/code )
{
    return code in fun  ?  fun[ code ]  :  (fun[ code ] = new Function( 'a', 'b', code )); /* a & b are optional */
}

function run( /*string*/code, /*?*/a, /*?*/b ) 
/* a & b are optional */
{
    return (code in fun  ?  fun[ code ]  :  fun( code ))( a, b );
}


function sPad( /*string*/s, /*integer (number of chars): csize>0 for begin-pad, csize<0 for end-pad*/signed_csize, /*?string?*/p )
{
    p  ||  (p="0");
    var end = signed_csize < 0
    , csize = end  ?  -signed_csize  :  signed_csize
    ,   out = s + ""
    ,   pad = sRep( p, Math.ceil( (csize - out.length) / p.length ) )
    ;
    return end ? out + pad : pad + out;
}

function sRep( /*string*/s, /*integer*/n )
{
    return n > 1  
        ?  (s.repeat  ?  s.repeat( n )  :  Array.apply( 0, n ).map( _ => s ).join( '' ))
        :  n == 1  ?  s
        :  n == 0  ?  ''
        :  null
    ;
}

function xhrGetSync( href )
/* yes, as of 2016 "sync" already deprecated, but still useful for quick test purposes */
{
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', href, false );
    xhr.send();
    return xhr.responseText;
}
