import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pipeFilterPlate',
})
export class PipeFilterPlatePipe implements PipeTransform {
    public transform(value: any, arg: any): any {
        const valueFilter = [];
        for (const post of value) {
            if (post.plate.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
                valueFilter.push(post);
            }
        }
        return valueFilter;
    }
}
