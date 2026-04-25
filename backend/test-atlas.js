// test-dns-propagation.js
import dns from 'dns/promises';

async function checkDNS() {
  console.log('🔍 Checking DNS propagation for deetech.e47yovh.mongodb.net...\n');
  
  // Try different DNS servers
  const dnsServers = [
    '8.8.8.8',     // Google DNS
    '1.1.1.1',     // Cloudflare
    '208.67.222.222' // OpenDNS
  ];
  
  for (const server of dnsServers) {
    try {
      const resolver = new dns.Resolver();
      resolver.setServers([server]);
      
      const addresses = await resolver.resolve4('deetech.e47yovh.mongodb.net');
      console.log(`✅ ${server} resolves to:`, addresses);
    } catch (err) {
      console.log(`❌ ${server} cannot resolve: ${err.message}`);
    }
  }
  
  console.log('\n🔄 Testing SRV records...');
  try {
    const srvRecords = await dns.resolveSrv('_mongodb._tcp.deetech.e47yovh.mongodb.net');
    console.log('✅ SRV records found:', srvRecords);
  } catch (err) {
    console.log('❌ SRV records not found:', err.message);
  }
}

checkDNS();