const {dest, src, series, task} = require('gulp');
const ts = require('gulp-typescript');

const eslint = require('gulp-eslint')
const gulpIf = require('gulp-if');
function isFixed(file) {
    return file.eslint !== null && file.eslint.fixed;
}
task('eslint', () => {
    return src(['./**/*.ts', "!./node_modules/**/*.ts"])
        .pipe(eslint({
            fix: true,
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, dest('./')))
        .pipe(eslint.failAfterError())
});
task('scripts', function () {
    let tsconfig = require('./tsconfig.json');
    let filesGlob = tsconfig.filesGlob;
    return src(filesGlob)
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(dest('./'))
});


task('default', series('eslint', 'scripts'));
