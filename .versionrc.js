module.exports = () => {
    // abort if not run from the 'develop' branch
    let currentBranch = require('child_process').execSync("git branch --show-current").toString().trim()
    if (currentBranch !== "develop") {
        console.error(`*** Releases should only be initiated from the 'develop' branch. (Current branch is: ${currentBranch})\n\nstandard-version will now terminate.\n`);
        process.exit(0);
    }
    // get all command line arguments passed to standard-version as a single string
    const arguments = process.argv.slice(2).join(" ");
    // using the next-standard-version wrapper, extract the recomended semver bump to a variable (passing along all command-line arguments to ensure we get the same result)
    const nextVersion = require('child_process').execSync(`npx --no next-standard-version -- ${arguments}`).toString().trim();
    return {
        types: [
            {
                type: "feat",
                section: "✨ Features"
            },
            {
                type: "fix",
                section: "🐛 Bug Fixes"
            },
            {
                type: "build",
                section: "📦 Build"
            },
            {
                type: "chore",
                hidden: true
            },
            {
                type: "ci",
                section: "🔄 CI/CD",
                hidden: true
            },
            {
                type: "docs",
                section: "📖 Documentation"
            },
            {
                type: "refactor",
                section: "♻️ Refactors",
                hidden: true
            },
            {
                type: "perf",
                section: "⚡️Performance Improvements"
            },
            {
                type: "style",
                section: "🎨 Style",
                hidden: true
            },
            {
                type: "test",
                section: "✅ Tests",
                hidden: true
            }
        ],
        releaseCommitMessageFormat: "build(release): initiate release - {{currentTag}}\n\nAutomated using `standard-version`.",
        scripts: {
            prerelease: `git checkout -b release/${nextVersion}` //use incoming semver bump to name new release branch
        },
        skip: {
            tag: true
        }
    }
}