# start-mongo-replica.ps1
$mongod = "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
$mongosh = "C:\Program Files\MongoDB\mongosh\bin\mongosh.exe"

# Step 1: Start mongod with replica set enabled
Start-Process -FilePath $mongod -ArgumentList "--dbpath C:\data\db --replSet rs0 --port 27018" -NoNewWindow

Start-Sleep -Seconds 5  # wait for mongod to boot

# Step 2: Open mongosh and initiate replica set
& $mongosh --port 27018 --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27018' }] })"
& $mongosh --port 27018
