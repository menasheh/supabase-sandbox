Required Steps:

1. Add the following to etc/hosts:
```
127.0.0.1 realtime-dev-tenant.localhost
```

2. grab supabase realtime from github and build it:
3. check out release tag 2.24.1
4. docker-compose build
5. docker-compose up

6. cd src/app && pnpm i && pnpm run dev
7. Run the src/backend/webapi project in visual studio 