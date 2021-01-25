import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AdminUser from 'src/views/ADM/Management/AdminUserMgt';
import JoinUser from 'src/views/ADM/Service/JoinUser';
import News from 'src/views/ADM/Service/NewsMgt';
import Api from 'src/views/ADM/System/ApiMgt';
import Scrn from 'src/views/ADM/System/ScrnMgt';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import MachineSW from 'src/views/ADM/System/MachineSwMgt';
import CodeMgt from 'src/views/MDM/CodeMgt';
import MachineSttgMgt from 'src/views/MDM/MachineSttgMgt';
import AreaMgt from 'src/views/MDM/AreaMgt';
import DealerMgt from 'src/views/MDM/DealerMgt';
import GameMgt from 'src/views/MDM/GameMgt';
import ShopMgt from 'src/views/MDM/ShopMgt';
import MenuMgt from 'src/views/ADM/System/MenuMgt';
import AuthorizationMgt from 'src/views/ADM/System/AuthorizationMgt';
import MultiLangMgt from 'src/views/ADM/System/MultiLangMgt';
import MachineMgt from 'src/views/MCM/HIPONG/McnMgt';
import MachineSts from 'src/views/MCM/HIPONG/McnStsMgt';
import MachinePgms from 'src/views/MCM/HIPONG/McnPgmMgt';
import MachinePgmDLs from 'src/views/MCM/HIPONG/McnPgmDLMgt';
import GameRankMgt from 'src/views/GDM/HIPONG/GmeRankMgt';
import GameBokMgt from 'src/views/GDM/HIPONG/GmeBokMgt';
export const loginInRoutes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'adm/usrs', element: <AdminUser /> },         //사용자관리
      { path: 'adm/service/usrs', element: <JoinUser /> },  //가입자관리
      { path: 'adm/ntcs', element: <News /> },              //공지사항
      { path: 'sys/machinesw', element: <MachineSW /> },    //머신SW저장소관리
      { path: 'sys/apis', element: <Api /> },            //API관리
      { path: 'sys/scrns', element: <Scrn /> },          //화면관리
      { path: 'sys/mnus', element: <MenuMgt /> },            //메뉴관리
      { path: 'sys/autrs', element: <AuthorizationMgt /> },          //권한관리
      { path: 'sys/mlangs', element: <MultiLangMgt /> },            //다국어관리
      { path: 'mdm/codes', element: <CodeMgt /> },          //다국어관리
      { path: 'mdm/areas', element: <AreaMgt /> },          //지역관리
      { path: 'mdm/dlrs', element: <DealerMgt /> },         //딜러관리
      { path: 'mdm/shps', element: <ShopMgt /> },           //샵관리
      { path: 'mdm/gmes', element: <GameMgt /> },           //게임관리
      { path: 'mdm/mcnsttgs', element: <MachineSttgMgt /> },//머신설정항목관리
      { path: 'mcm/mcns', element: <MachineMgt /> },        //머신관리
      { path: 'mcm/mcnsts', element: <MachineSts /> },      //머신현황
      { path: 'mcm/mcnpgms', element: <MachinePgms /> },    //머신프로그램관리
      { path: 'mcm/mcnpgmdl', element: <MachinePgmDLs /> },    //머신프로그램관리
      { path: 'gdm/gmeranks', element: <GameRankMgt /> },    //게임순위관리
      { path: 'gdm/gmeboks', element: <GameBokMgt /> },    //게임이력관리
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '*', element: <Navigate to="/dashboard" /> },
    ]
  }
];
export const loginOutRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/login', element: <LoginView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/login" /> }
    ]
  }
];
