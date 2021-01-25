// import React, { useEffect, useState } from 'react';
// import TreeView from '@material-ui/lab/TreeView';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import TreeItem from '@material-ui/lab/TreeItem';
// import { Checkbox, FormControlLabel } from '@material-ui/core';

// import { useQuery } from '@apollo/react-hooks';
// import { GET_AREA_TREE } from '../NewsQuery';
// import { useDataDispatch, useDataState } from '../NewsContext';
// import { treeHandle } from './NewsUtils';


// export default function DetailTree() {
 
//   const dispatch = useDataDispatch();
//   const { ntcDetailData,inputReadOnly } = useDataState();
//   const { data: TreeData } = useQuery(GET_AREA_TREE, {
//     variables: {
//       AREA_NM: '',
//       ver: 'v1'
//     }
//   });

//   const data = {
//     id: '1',
//     name: TreeData?.getAreaTree?.name,
//     children: TreeData?.getAreaTree?.children?.map(item => item)
//   };
//   const [selected, setSelected] = useState([]);

//   useEffect(() => {
//     if (ntcDetailData !== undefined) {
//       setSelected(()=>treeHandle(ntcDetailData?.NAT_CD_LST,ntcDetailData?.STT_CD_LST));
//       dispatch({
//         type: 'TREE_DATA',
//         treeData: {
//           NAT_CD_LST: ntcDetailData?.NAT_CD_LST,
//           STT_CD_LST: ntcDetailData?.STT_CD_LST
//         }
//       });
//     }
  
     
//   }, [ntcDetailData,dispatch,setSelected]);

//   function getNodeById(nodes, id) {
//     if (nodes.id === id) {
//       return nodes;
//     } else if (Array.isArray(nodes.children)) {
//       let result = null;
//       nodes.children.forEach(node => {
//         if (!!getNodeById(node, id)) {
//           result = getNodeById(node, id);
//         }
//       });
//       return result;
//     }

//     return null;
//   }

//   function getChildById(node, id) {
//     let array = [];

//     function getAllChild(nodes) {
//       if (nodes === null) return [];
//       array.push(nodes.id);
//       if (Array.isArray(nodes.children)) {
//         nodes.children.forEach(node => {
//           array = [...array, ...getAllChild(node)];
//           array = array.filter((v, i) => array.indexOf(v) === i);
//         });
//       }
//       return array;
//     }

//     return getAllChild(getNodeById(node, id));
//   }
//   function getSelectedNodes(node, selected) {
//     let array = [];
//     for (var i = 0; i < selected.length; i++) {
//       const item = getNodeById(node, selected[i])
//       if(item) {
//         array.push(item)
//       }      
//     }
//     return Array.from(new Set(array));
//   }
//   function getOnChange(checked, nodes) {
 
//     const allNode = getChildById(data, nodes.id);

//     let array = checked
//       ? [...selected, ...allNode]
//       : selected.filter((value) => !allNode.includes(value));

//     array = array.filter((v, i) => array.indexOf(v) === i);
//     setSelected(array);
    
//     const arryObj = getSelectedNodes(data, array)
//     dispatch({
//       type: 'TREE_DATA',
//       treeData: {
//         NAT_CD_LST: arryObj?.filter(items => items.AREA_TP_CD === '001')
//           .map(item => item.id).toString(),
//         STT_CD_LST: arryObj?.filter(items => items.AREA_TP_CD === '002')
//           .map(item => item.id).toString()
//       }
//     });
//   }
//   function treeClick(ev) {
//     ev.stopPropagation();
//   }
//   const renderTree = nodes => (
//     <TreeItem
//       key={nodes.id}
//       nodeId={nodes.id}
//       label={
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={selected.some(item => item === nodes.id)}
//               onChange={event => inputReadOnly ? getOnChange(event.currentTarget.checked, nodes):null}
//               onClick={treeClick}
//             />
//           }
//           label={<>{nodes.name}</>}
//           key={nodes.id}
//         />
//       }
//     >
//       {Array.isArray(nodes.children)
//         ? nodes.children.map(node => renderTree(node))
//         : null}
//     </TreeItem>
//   );

//   return (
//     <TreeView
     
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       //   defaultExpanded={['0', '3', '4']}
//       defaultExpandIcon={<ChevronRightIcon />}
//     >
//       {renderTree(data)}
//     </TreeView>
//   );
// }
