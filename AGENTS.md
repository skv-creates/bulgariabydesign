<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Environment access

You have authenticated access to both git and Vercel on this machine.

- **Git**: `origin` is `https://github.com/skv-creates/bulgariabydesign`,
  main branch is `main`, pushes trigger Vercel auto-deploy. Commit and
  push when the user asks — don't copy-paste diffs into the chat.
- **Vercel CLI**: installed and logged in as `skv-creates` (team
  `stefanvladimirov-mecoms-projects`). This folder is linked to the
  `bulgariabydesign` project. You can run `vercel env`, `vercel deploy`,
  `vercel ls`, etc. without further setup.
- **Vercel REST API**: when the CLI lacks a command (e.g. changing
  Framework Preset), the auth token lives at
  `~/Library/Application Support/com.vercel.cli/auth.json`. Use
  `Authorization: Bearer $TOKEN` against `api.vercel.com`. Project id
  `prj_z2Xd1Dbqo2umesgyo93N5lFcPhnm`, team id
  `team_CzvQdqEV6YBSKxiH1zyK21eS`.

So the fastest path is usually to run the command, not to write a
dashboard walkthrough for the user.

# Open work

See `ROADMAP.md` for outstanding items (alt text, asset re-exports).
