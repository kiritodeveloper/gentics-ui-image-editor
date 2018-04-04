import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input, OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import {CropperService} from '../../providers/cropper.service';
import {AspectRatio} from '../../models';

/**
 * A component which wraps the Cropperjs instance.
 */
@Component({
    selector: 'gentics-image-cropper',
    templateUrl: 'image-cropper.component.html',
    styleUrls: ['image-cropper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent implements OnChanges {

    @Input() src: string;
    @Input() enabled = false;
    @Input() aspectRatio: AspectRatio;
    @Output() imageLoad = new EventEmitter<void>();

    @ViewChild('sourceImage') sourceImage: ElementRef;

    @HostBinding('class.resizing')
    resizing = false;

    constructor(private cropperService: CropperService,
                private changeDetector: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('enabled' in changes) {
            if (this.enabled) {
                this.cropperService.enable(this.sourceImage.nativeElement, this.aspectRatio)
                    .then(() => this.imageLoad.emit());
            } else {
                this.cropperService.disable();
            }
        }
        if ('src' in changes) {
            if (this.enabled) {
                setTimeout(() => {
                    this.cropperService.enable(this.sourceImage.nativeElement, this.aspectRatio)
                        .then(() => this.imageLoad.emit());
                });
            }
        }
        if ('aspectRatio' in changes) {
            this.cropperService.setCropAspectRatio(this.aspectRatio);
        }
    }

    @HostListener('window:resize')
    resizeHandler(): void {
        this.resizing = true;
        const onComplete = () => {
            this.resizing = false;
            this.changeDetector.markForCheck();
        };
        this.cropperService.resizeHandler(300, onComplete);
    }
}
