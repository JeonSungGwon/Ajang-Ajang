package com.ajangajang.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode {

    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 게시글"),
    MEDIA_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 미디어"),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 카테고리"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 유저"),
    CHILD_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 아이"),
    LIKE_NOT_FOUND(HttpStatus.NOT_FOUND, "좋아요한 적 없는 게시글"),
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 리뷰"),
    ADDRESS_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 주소"),
    NEARTYPE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 거리 타입"),
    TRADE_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 거래내역"),
    STATUS_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 판매 상태"),
    MAIN_CHILD_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 메인 아이"),

    EMPTY_UPDATE_DATA(HttpStatus.BAD_REQUEST, "업데이트할 데이터 없음"),
    ALREADY_LIKED(HttpStatus.BAD_REQUEST, "이미 좋아요한 게시글"),
    SELF_LIKE_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "자신의 게시글은 선택할 수 없음"),
    INVALID_NEAR_TYPE(HttpStatus.BAD_REQUEST, "잘못된 거리 타입"),
    DUPLICATE_ADDRESS(HttpStatus.BAD_REQUEST, "이미 존재하는 주소"),
    MAIN_CHILD_DELETE_FAIL(HttpStatus.BAD_REQUEST, "대표 자녀는 삭제 불가"),
    MAIN_ADDRESS_DELETE_FAIL(HttpStatus.BAD_REQUEST, "대표 주소는 삭제 불가"),
    INVALID_BIRTHDATE(HttpStatus.BAD_REQUEST, "현재 날짜보다 늦게 태어날 수 없음"),
    AT_LEAST_ONE_MEDIA_REQUIRED(HttpStatus.BAD_REQUEST, "이미지는 최소 1개는 있어야함"),
    AT_LEAST_ONE_ADDRESS_REQUIRED(HttpStatus.BAD_REQUEST, "주소는 최소 1개는 있어야함"),

    FILE_UPLOAD_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패"),
    API_CALL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "API 호출 실패"),


    UNSUPPORTED_FILE_FORMAT(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 파일 형식"),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN, "변경 권한이 없음"),

    SMS_CERTIFICATION_FAIL(HttpStatus.BAD_REQUEST, "인증번호가 일치하지 않습니다.");

    private final HttpStatus statusCode;
    private final String message;

}
