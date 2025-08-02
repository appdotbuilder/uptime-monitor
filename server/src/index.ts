
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { 
  createMonitorInputSchema, 
  updateMonitorInputSchema, 
  getUserMonitorsInputSchema,
  deleteMonitorInputSchema,
  getMonitorStatusInputSchema
} from './schema';
import { createMonitor } from './handlers/create_monitor';
import { getUserMonitors } from './handlers/get_user_monitors';
import { updateMonitor } from './handlers/update_monitor';
import { deleteMonitor } from './handlers/delete_monitor';
import { getMonitorStatus } from './handlers/get_monitor_status';
import { getActiveMonitors } from './handlers/get_active_monitors';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Monitor management endpoints
  createMonitor: publicProcedure
    .input(createMonitorInputSchema)
    .mutation(({ input }) => createMonitor(input)),
    
  getUserMonitors: publicProcedure
    .input(getUserMonitorsInputSchema)
    .query(({ input }) => getUserMonitors(input)),
    
  updateMonitor: publicProcedure
    .input(updateMonitorInputSchema)
    .mutation(({ input }) => updateMonitor(input)),
    
  deleteMonitor: publicProcedure
    .input(deleteMonitorInputSchema)
    .mutation(({ input }) => deleteMonitor(input)),
    
  // Status and monitoring endpoints
  getMonitorStatus: publicProcedure
    .input(getMonitorStatusInputSchema)
    .query(({ input }) => getMonitorStatus(input)),
    
  getActiveMonitors: publicProcedure
    .query(() => getActiveMonitors())
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
