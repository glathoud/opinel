/*
  opinel.js

  A bunch of useful small functions & shortcuts for JavaScript.
  Use at your own risk. See the file ./LICENSE

  Guillaume Lathoud, 2016
  glat@glat.info
*/

/* getters: pure functions */

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

function hh( /*string, e.g. 'div' or 'div class="myclass"'*/tname, /*?string | array of string?*/html ) 
{
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

/* Note: functions are objects, so we can define convenient shortcuts
 * e.g. `hh.div( <html> )`, `hh.span( <html> )` etc.
 */
[ 'a', 'blockquote', 'button', 'cite', 'code', 'dd', 'div', 'dl', 'dt'
  , 'em', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  , 'hr', 'iframe', 'img', 'input', 'li', 'ol', 'option', 'p', 'pre', 
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

/* getter-setters */

function gs( pname, obj, code )
{
    return pname in obj  ?  obj[ pname ]  :  (obj[ pname ] = run( 'return ' + code, obj ));
}

/* modifiers: setters returning their first parameter */

function aEL( node, ename, clientfun, /*?*/capture )
{
    (node  ||  document).addEventListener( ename, clientfun, capture );
}

function rA( node, aname, value )
{
    node.removeAttribute( aname, value );
    return node;
}

function sA( node, aname, value )
{
    node.setAttribute( aname, value );
    return node;
}

function sP( node, propname, value )
{
    node[ propname ] = value;
    return node;
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

function fun( /*string*/code )
{
    return code in fun  ?  fun[ code ]  :  (fun[ code ] = new Function( 'a', 'b', code )); /* a & b are optional */
}

function run( /*string*/code, /*?*/a, /*?*/b ) 
/* a & b are optional */
{
    return (code in fun  ?  fun[ code ]  :  fun( code ))( a, b );
}


function xhrGetSync( href )
/* yes, as of 2016 "sync" already deprecated, but still useful for quick test purposes */
{
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', href, false );
    xhr.send();
    return xhr.responseText;
}
