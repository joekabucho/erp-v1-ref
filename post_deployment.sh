#!/bin/bash

echo " "
echo "<<<<<<<<<<< Remove package lock >>>>>>>>>>>>>>"
sudo rm -rf package-lock.json

echo " "
echo "<<<<<<<<<<< Installing requirements >>>>>>>>>>>>>>"

echo " "
sudo npm install

echo "<<<<<<<<<<<<<< Run Build >>>>>>>>>>>>>>>>>>>>>>>"

echo " "
sudo npm run config && sudo ng build --prod


echo "<<<<<<<<<<<<<<' Update build '>>>>>>>>>>>>>>>>>>>>>>>"

echo " "
sudo cp -r dist/* /var/www/arpprod/

echo " "
echo " "
echo "<<<<<<<<<<<<<<<< Restarting nginx >>>>>>>>>>>>>>>>>>>>>>"
echo " "
sudo systemctl restart nginx

exit
