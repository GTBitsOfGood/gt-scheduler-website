import React, { useCallback, useContext, useEffect } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { classes, getContentClassName } from '../../utils/misc';
import Cancellable from '../../utils/cancellable';
import { ActionRow } from '..';
import { ScheduleContext } from '../../contexts';
import { Course as CourseBean } from '../../data/beans';

import './stylesheet.scss';

export type CourseMinimalProps = {
  className?: string;
  courseId: string;
  onAddCourse?: () => void;
};

export default function CourseMinimal({
  className,
  courseId,
}: CourseMinimalProps): React.ReactElement | null {
  const [
    { oscar, desiredCourses, pinnedCrns, excludedCrns, colorMap },
    { patchSchedule },
  ] = useContext(ScheduleContext);

  useEffect(() => {
    const course = oscar.findCourse(courseId);
    if (course == null) return;

    // Allow the operation to be cancelled early (if the component unmounts)
    const loadOperation = new Cancellable();
    return (): void => {
      loadOperation.cancel();
    };
  }, [oscar, courseId]);

  const handleRemoveCourse = useCallback(
    (course: CourseBean) => {
      const newColorMap = { ...colorMap };
      delete newColorMap[course.id];

      patchSchedule({
        desiredCourses: desiredCourses.filter((id) => id !== course.id),
        pinnedCrns: pinnedCrns.filter(
          (crn) => !course.sections.some((section) => section.crn === crn)
        ),
        excludedCrns: excludedCrns.filter(
          (crn) => !course.sections.some((section) => section.crn === crn)
        ),
        colorMap: newColorMap,
      });
    },
    [desiredCourses, pinnedCrns, excludedCrns, colorMap, patchSchedule]
  );

  const course = oscar.findCourse(courseId);
  if (course == null) return null;

  const color = colorMap[course.id];
  const contentClassName = color != null && getContentClassName(color);

  return (
    <div
      className={classes('Course', contentClassName, 'default', className)}
      style={{ backgroundColor: color }}
      key={course.id}
    >
      <ActionRow
        label={course.id}
        actions={[
          {
            icon: faTrash,
            onClick: (): void => handleRemoveCourse(course),
          },
        ]}
      >
        <div className="course-row">
          <span className="course-title">{course.title}</span>
        </div>
      </ActionRow>
    </div>
  );
}
