pm2 delete pds_admin_ui
export PORT=4000
pm2 start yarn --name pds_admin_ui -- start