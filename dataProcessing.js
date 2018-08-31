
var topicName=['Image', 'Layout',  'Copy', 'Font', 'Color'];

//TEST ARRAY
var ImagePositive = [
{id:"2-1" , urgency: 1 , effort: 2, content:"image positive one."}, 
{id:"5-1" , urgency: 1 , effort: 2, content:"image positive two."},
{id:"5-2" , urgency: 1 , effort: 2, content:"image positive three."}];// ima array

var ImageNegative = [
{id:"1-2" , urgency: 2 , effort: 2, content:"image negative one."}, 
{id:"1-4" , urgency: 3 ,  effort: 2, content:"image negative two."}];// ima array

var ImageSuggesion = [
{id:"1-5" , urgency: 4 , effort: 5, content:"image suggesion one."}, 
{id:"4-2" , urgency: 2 , effort: 5, content:"image suggesion two."},
{id:"4-5" , urgency: 2 , effort: 4, content:"image suggesion two."},
{id:"6-4" , urgency: 3 , effort: 4, content:"image suggesion two."}];// ima array

//IMAGE POSITIVE
var LayoutPositive = [
{id:"3-1",  urgency: 1 , effort: 2, content:"layout negative two."}
];// ima array

var LayoutNegative = [
{id:"1-1" , urgency: 3, effort: 4, content:"layout negative one."},
{id:"2-2" , urgency: 3, effort: 4, content:"layout negative two."},
{id:"2-4", urgency: 3 , effort: 3, content:"layout negative two."},
{id:"3-3",  urgency: 3 , effort: 3, content:"layout negative two."},
{id:"4-0",  urgency: 3 , effort: 4, content:"layout negative two."},
{id:"4-3",  urgency: 3 , effort: 2, content:"layout negative two."},
{id:"5-2",urgency: 3 , effort: 1,   content:"layout negative two."},
];// ima array

var LayoutSuggestion = [
];// ima array


var CopyPositive = [{id:"3-0" , urgency: 3 , effort: 2, content:"layout negative one."}];// ima array

var CopyNegative = [
{id:"2-6" , urgency: 3 , effort: 2, content:"layout negative one."}];// ima array

var CopySuggesion = [{id:"3-5" , urgency: 3 , effort: 2, content:"layout negative one."},
{id:"4-6" , urgency: 3 , effort: 2, content:"layout negative one."}
];// ima array


var FontPositive = [ ];// ima array

var FontNegative = [
{id:"3-2" , urgency: 3 , effort: 1, content:"image negative one."},
{id:"3-4" , urgency: 3 , effort: 2, content:"image negative one."}];// ima array

var FontSuggesion = [
{id:"4-4" , urgency: 3 , effort: 2, content:"image suggesion one."},
{id:"6-3" , urgency: 3 , effort: 2, content:"image suggesion one."}];// ima array


var ColorPositive = [ ];// ima array

var ColorNegative = [
{id:"1-3" , urgency: 3 , effort: 3, content:"image negative one."}];// ima array

var ColorSuggesion = [
{id:"4-1" , urgency: 3 , effort: 4, content:"image suggesion one."},
{id:"5-3" , urgency: 3 , effort: 4, content:"image suggesion one."},
{id:"6-1" , urgency: 3 , effort: 4, content:"image suggesion one."}];// ima array


var imageArray = new Array(3);
imageArray[0]= ImagePositive;
imageArray[1]= ImageNegative;
imageArray[2]= ImageSuggesion;
var layoutArray = new Array(3);
layoutArray[0]= LayoutPositive;
layoutArray[1]= LayoutNegative;
layoutArray[2]= LayoutSuggestion;

var copyArray = new Array(3);
copyArray[0]= CopyPositive;
copyArray[1]= CopyNegative;
copyArray[2]= CopySuggesion;

var fontArray = new Array(3);
fontArray[0]= FontPositive;
fontArray[1]= FontNegative;
fontArray[2]= FontSuggesion;

var colorArray = new Array(3);
colorArray[0]= ColorPositive;
colorArray[1]= ColorNegative;
colorArray[2]= ColorSuggesion;

var topicArray = new Array(5);
topicArray[0]=imageArray; 
topicArray[1]=layoutArray;
topicArray[2]=copyArray;
topicArray[3]=fontArray;
topicArray[4]=colorArray;