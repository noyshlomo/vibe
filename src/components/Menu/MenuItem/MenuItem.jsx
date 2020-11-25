import React, { useCallback, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Icon from "../../Icon/Icon";
import isFunction from "lodash/isFunction";
import useKeyEvent from "../../../hooks/useKeyEvent";
import useEventListener from "../../../hooks/useEventListener";
import "./MenuItem.scss";

const MenuItem = ({
  classname,
  title,
  icon,
  iconType,
  disabled,
  onClick,
  activeItemIndex,
  setActiveItemIndex,
  index,
}) => {
  const renderMenuItemIconIfNeeded = () => {
    if (icon) {
      let finalIconType = iconType;
      if (!finalIconType) {
        finalIconType = isFunction(icon) ? Icon.type.SVG : Icon.type.ICON_FONT;
      }

      return (
        <div className="monday-style-menu-item__icon-wrapper">
          <Icon
            iconType={finalIconType}
            clickable={false}
            icon={icon}
            iconLabel={title}
            className={"monday-style-menu-item__icon"}
            ignoreFocusStyle
          />
        </div>
      );
    }
  };

  const [isActive, setIsActive] = useState(activeItemIndex === index);

  useEffect(() => {
    setIsActive(activeItemIndex === index);
  }, [activeItemIndex]);

  const onClickCallback = useCallback(
    (event) => {
      if (onClick && !disabled && isActive) {
        onClick(event);
      }
    },
    [onClick, disabled, isActive]
  );

  const setActive = () => {
    if (setActiveItemIndex) {
      setActiveItemIndex(index);
    } else {
      setIsActive(true);
    }
  };

  const setUnActive = () => {
    if (setActiveItemIndex) {
      setActiveItemIndex(-1);
    } else {
      setIsActive(false);
    }
  };

  const createFocusRef = () => {
    const itemRef = useRef(null);

    useEffect(() => {
      isActive && itemRef && itemRef.current && itemRef.current.focus();
    }, [isActive]);

    const handleMouseOver = () => setActive();
    const handleMouseOut = () => setUnActive();

    useEventListener({
      eventName: "mouseover",
      ref: itemRef,
      callback: handleMouseOver,
    });
    useEventListener({
      eventName: "mouseout",
      ref: itemRef,
      callback: handleMouseOut,
    });

    return itemRef;
  };

  useKeyEvent({ keys: ["Enter"], callback: onClickCallback });

  const ref = createFocusRef();

  return (
    <div
      className={cx("monday-style-menu-item", classname, {
        "monday-style-menu-item--disabled": disabled,
        "monday-style-menu-item--focused": isActive,
      })}
      ref={ref}
      onClick={onClickCallback}
    >
      {renderMenuItemIconIfNeeded()}
      <div className="monday-style-menu-item__title">{title}</div>
    </div>
  );
};

MenuItem.defaultProps = {
  classname: "",
  title: "",
  icon: "",
  iconType: undefined,
  disabled: false,
  onClick: undefined,
  activeItemIndex: -1,
  setActiveItemIndex: undefined,
  index: undefined,
};
MenuItem.propTypes = {
  classname: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  iconType: PropTypes.oneOf([Icon.type.SVG, Icon.type.ICON_FONT]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  activeItemIndex: PropTypes.number,
  setActiveItemIndex: PropTypes.func,
  index: PropTypes.number,
};

MenuItem.isSelectable = true;

export default MenuItem;
