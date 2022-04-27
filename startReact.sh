cd client
ip4=$(/sbin/ip -o -4 addr list eth0 | awk '{print $4}' | cut -d/ -f1)
REACT_APP_NOT_SECRET_CODE=${ip4} npm start