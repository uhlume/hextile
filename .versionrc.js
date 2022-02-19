module.exports = () => {
    // abort standard-version if not run from the 'develop' branch
    const currentBranch = require('child_process').execSync("git branch --show-current").toString().trim()
    if (currentBranch !== "develop") {
        console.error(`*** Releases should only be initiated from the 'develop' branch. (Current branch is: ${currentBranch})\n\nstandard-version will now terminate.\n`);
        process.exit(0);
    }

    // configure commit types for changelog generation here
    const types = {
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
        ]
    };

    let nextVersion = "0.0.0";
    let releaseOptions = {};

    // don't bother producing config options for release if run with '--dry-run' flag
    if (!process.argv.includes("--dry-run")) {

        // get the next expected version number, for release branch naming
        if (process.argv.includes("--first-release")) {
            // don't try to obtain the updated version number if run with the '--first-release' flag; 
            // instead, set nextVersion to the current version in package.json
            nextVersion = require('./package.json').version;
        } else {
            // otherwise, use sed to extract the recomended semver bump to a variable (passing along all command-line arguments to ensure we get the same result)
            nextVersion = require('child_process').execSync(`bash -c "standard-version --dry-run ${arguments} | sed -e '1!d' -e 's/.*to //g'"`).toString().trim();
        }

        // populate release options 
        releaseOptions = {
            releaseCommitMessageFormat: "build(release): initiate release - {{currentTag}}\n\nAutomated using `standard-version`.",
            scripts: {
                prerelease: `git checkout -b release/${nextVersion}` //use incoming semver bump to name new release branch
            },
            skip: {
                tag: true
            }
        }
    }

    // return config object with all generated options
    return {
        ...types,
        ...releaseOptions
    }
}