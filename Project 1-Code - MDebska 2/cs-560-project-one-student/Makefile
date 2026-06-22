.PHONY: setup clean

setup:
	cd frontend && npm install
	cd backend && npm install
	cd backend && npm run seed

clean:
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -f backend/*.db
