// var points = [[1,1],[5,3],[4,2],[8,4],[1,2],[5,7],[8,2]];
// 
// function kdtree (points_list, depth) {
// 
//   var node = {};
//       
//   if (points_list.length == 1) {
//     node.point = points_list[0];
//     return node;
//   }
//   
//   var axis = depth % 2;
//     
//   points_list = points_list.sort( function (a,b) {
//     return parseFloat(a[axis]) - parseFloat(b[axis])
//   });
// 
//   var median = points_list.length / 2 >> 0;
//   
//   node.axis   = axis;
//   node.value  = points_list[median][axis];
//   node.left   = kdtree(points_list.slice(0,median), depth + 1);
//   node.right  = kdtree(points_list.slice(median,points_list.length), depth + 1);  
//   return node;
// }
// 
// function NNS (point,node,p) {
//   
// }
//  
// console.log(Infinity<0);
//  
// // console.log(kdtree(points,0));
// 
// // console.log(points.length);
