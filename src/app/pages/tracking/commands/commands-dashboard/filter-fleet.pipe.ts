import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pipeFilterFleet',
})
export class PipeFilterPipe implements PipeTransform {
    public transform(value: any, arg: any): any {
        const valueFilter = [];
        for (const post of value) {
            if (post.name.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
                valueFilter.push(post);
            }
        }
        return valueFilter;
    }
}
