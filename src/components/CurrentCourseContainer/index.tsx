import React, { useContext } from 'react';

import { CourseMinimal } from '..';
import { ScheduleContext } from '../../contexts';

import './stylesheet.scss';

export default function CurrentCourseContainer(): React.ReactElement {
  const [{ oscar, desiredCourses }] = useContext(ScheduleContext);

  return (
    <div className="CurrentCourseContainer">
      <h3 className="label">My courses</h3>
      <div className="scroller">
        {desiredCourses.length > 0 ? (
          <div className="course-list">
            {desiredCourses.map((courseId) => {
              return <CourseMinimal courseId={courseId} key={courseId} />;
            })}
          </div>
        ) : (
          <div className="default-icon">
            <div>
              <img
                src="/courseSearchDefault.png"
                alt="Course Search Default Icon"
                style={{ width: '120px', margin: '0 auto' }}
              />
            </div>
            <h3 className="label">My Courses</h3>
            <p>Courses you added will appear here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
