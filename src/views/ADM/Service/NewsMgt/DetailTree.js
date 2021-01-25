import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { GET_AREA_TREE } from './NewsQuery';
import {ver} from "src/components/Utils"



export default function DetailTree({NTC_ID,NAT_CD_LST,STT_CD_LST,ADD_FLAG,EDIT_FLAG, INPUT_READ_ONLY,SET_DTL_DATA}) { 
  const { data: TreeData } = useQuery(GET_AREA_TREE, {
    variables: {
      AREA_NM: '',
      ver
    }
  });

  const data = {
    id: 'root',
    name: TreeData?.getAreaTree?.name,
    children: TreeData?.getAreaTree?.children?.map(item => item)
  };
  const [selected, setSelected] = useState([]);
   /**
 * 그리드 데이터를 클릭시 국가코드,시도코드를 문자열(001,002,003)로 받은걸 배열로 변환시켜 디테일 인풋 초기셋팅을 함
 * @param {String} NAT_CD 국가코드
 * @param {String} STT_CD 시도코드 
 */
const treeHandle = (NAT_CD,STT_CD)=>{
  if (NAT_CD === undefined) {
    return [NAT_CD].concat(STT_CD.split(','));
  } else if (STT_CD === undefined) {
    return NAT_CD.split(',').concat([STT_CD]);
  } else if (STT_CD === undefined && NAT_CD===undefined) {
    return [NAT_CD].concat([STT_CD]);
  } else  {
   return NAT_CD.split(',').concat(STT_CD.split(','));
  }
}


  useEffect(() => {
    if (ADD_FLAG ===false && EDIT_FLAG ===false ) {
      if (NTC_ID !== "" ) {
      setSelected(()=>treeHandle(NAT_CD_LST,STT_CD_LST));
     }
  }
    if(ADD_FLAG){
      setSelected([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ADD_FLAG,EDIT_FLAG,NTC_ID]);
  
  
     
 

  function getNodeById(nodes, id) {
    if (nodes.id === id) {
      return nodes;
    } else if (Array.isArray(nodes.children)) {
      let result = null;
      nodes.children.forEach(node => {
        if (!!getNodeById(node, id)) {
          result = getNodeById(node, id);
        }
      });
      return result;
    }

    return null;
  }


  function getChildById(node, id) {
    let array = [];

    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach(node => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    return getAllChild(getNodeById(node, id));
  }


  function getSelectedNodes(node, selected) {
    let array = [];
    for (var i = 0; i < selected.length; i++) {
      const item = getNodeById(node, selected[i])
      if(item) {
        array.push(item)
      }      
    }
    return Array.from(new Set(array));
  }


  function getOnChange(checked, nodes) {
 
    const allNode = getChildById(data, nodes.id);

    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);
    setSelected(array);
   
    const arryObj = getSelectedNodes(data, array)

    SET_DTL_DATA(props=>({...props,
      NAT_CD_LST: arryObj?.filter(items => items.AREA_TP_CD === '001')
       .map(item => item.id).toString(),
      STT_CD_LST: arryObj?.filter(items => items.AREA_TP_CD === '002')
       .map(item => item.id).toString()
    }))
     

   
  }


  function treeClick(ev) {
    ev.stopPropagation();
  }
  const renderTree = nodes => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <FormControlLabel
        disabled={INPUT_READ_ONLY ?false:true}
          control={
            <Checkbox
              checked={selected.some(item => item === nodes.id)}
              onChange={event => getOnChange(event.currentTarget.checked, nodes)}
              onClick={treeClick}
            />
          }
          label={<>{nodes.name}</>}
          key={nodes.id}
        />
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}








