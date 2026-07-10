export const pinoHttpConfig = {
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: './log/app.log',
          mkdir: true,
        },
      },
    ],
  },
}
